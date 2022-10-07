import { useState, useEffect } from "react";
import { ErrorMessage } from "./styled";
import Loading from "./Loading";
import { ajaxGet as doAjax2, aysncUpdateState } from "../util/ajax";
import { T, createAction } from "../reducer";
import ScanListTable from "./tables/ScanListTable";

function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}
export default function ScanList(props) {
  return <ScanListTable {...props} />;
}
export function ScanList2(props) {
  const {
    dispatch,
    state2: {
      scanLog: { list, status }
    }
  } = props;
  const [visibleInputs, setVisibleInputs] = useState([]);

  function loadScans2() {
    aysncUpdateState(
      "GET",
      { action: "pxq_pgck_get_scans" },
      T.scanLog,
      "items"
    );
  }
  function loadScans() {
    return doAjax2(
      { action: "pxq_pgck_get_scans1" },
      (data) => {
        if (data.success) {
          console.log("scanlog", data.data.list.length, data.data);
          dispatch(
            createAction(T.scanLog, { items: data.data.list, status: 2 })
          );
          props.setState({
            ...props.state,
            balance: data.data.balance
          });
        }
      },
      (textStatus) => {
        if ("abort" === textStatus) {
          console.log("scanlog aborting jaax");
          return;
        }
        dispatch(createAction(T.scanLog, { list: null, status: 3 }));
      }
    );
  }
  useEffect(() => {
    if (2 === status) return;
    dispatch(createAction(T.scanLog, { status: 1 }));
    const xhr = loadScans();
    return () => {
      if (xhr) {
        console.log("unmounting scanlog");
        xhr.abort();
      }
    };
  }, [status]);

  let Comp = null;
  if (1 === status) {
    Comp = <Loading />;
  } else if (3 === status) {
    Comp = (
      <ErrorMessage>
        Failed to load plagiarmism checks. Please refresh!
      </ErrorMessage>
    );
  } else if (2 === status) {
    //const scans = state.scanList.filter((obj) => "draft" !== obj.status && "pending" !== obj.status);
    const items = list.filter(
      (obj) => "draft" !== obj.status && "pending" !== obj.status
    );
    let tbody = null;
    if (!items.length) {
      tbody = (
        <tr>
          <td colSpan={7} style={{ textAlign: "center", padding: "40px 30px" }}>
            You don't have any plagiarmism checks.
          </td>
        </tr>
      );
    } else {
      tbody = items
        /*.sort((a, b) => {
          //return Number(getCredits(a.type,a.credits)) - Number(getCredits(b.type,b.credits));
          const x = Number(getCredits(a.status, a.credits));
          const y = Number(getCredits(b.status, b.credits));
          //console.log(a.id,a.status,a.credits,b.credits,x,y)
          if (x < y) return -1;
          if (x > y) return 1;
          return 0;
        })
        */
        .map((obj) => (
          <>
            <tr
              key={obj.id}
              className={
                visibleInputs.includes(obj.id)
                  ? "pxq_pgck_open"
                  : "pxq_pgck_close"
              }
            >
              <td key="id">{obj.id}</td>
              <td key="type">{capitalize(obj.type)}</td>
              <td key="input">
                <a
                  href="#"
                  onClick={(e) => {
                    if (visibleInputs.includes(obj.id)) {
                      setVisibleInputs(
                        visibleInputs.filter((id) => id !== obj.id)
                      );
                    } else setVisibleInputs([...visibleInputs, obj.id]);
                    e.preventDefault();
                  }}
                >
                  {visibleInputs.includes(obj.id) ? "Hide" : "Show"}
                </a>
              </td>
              <td key="status">{getStatus(obj.status)}</td>
              <td key="credits">{getCredits(obj.status, obj.credits)}</td>
              <td key="date">{obj.created_at}</td>
              <td className="pxq_pgck_actions">
                {("check_failed" === obj.status ||
                  "checked" === obj.status) && (
                  <a
                    href="#"
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => {
                      const url =
                        window.pxq_pgck_main_url + "?pxq_pgck_sid=" + obj.id;
                      window.open(url, "_blank");
                      e.preventDefault();
                    }}
                  >
                    Resume
                  </a>
                )}
                {"exported" === obj.status && (
                  <>
                    <a
                      href="#"
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => {
                        const url =
                          window.pxq_pgck_report_url + "?scan_id=" + obj.id;
                        window.open(url, "_blank");
                        e.preventDefault();
                      }}
                    >
                      Report
                    </a>
                    <a
                      href="#"
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => {
                        const url = window.pxq_pgck_pdf_url.replace(
                          "{SCANID}",
                          obj.id
                        );
                        window.open(url, "_blank");
                        e.preventDefault();
                      }}
                    >
                      PDF
                    </a>
                  </>
                )}
              </td>
            </tr>
            {visibleInputs.includes(obj.id) && (
              <tr key={`${obj.id}_s`}>
                <td colSpan={7}>{getInput(obj.type, obj.input)}</td>
              </tr>
            )}
          </>
        ));
    }
    Comp = (
      <table
        style={{ textAlign: "left", width: "100%" }}
        className="pxq_pgck_list_table"
      >
        <thead>
          <tr>
            <th key="id">ID</th>
            <th key="type">Type</th>
            <th key="input">Input</th>
            <th key="status">Last activity</th>
            <th key="credit">Credits used</th>
            <th key="date">Created at</th>
            <th key="actions"> </th>
          </tr>
        </thead>
        <tbody>{tbody}</tbody>
      </table>
    );
  }
  return (
    <div>
      <div style={{ textAlign: "left", marginBottom: "10px" }}>
        <button
          disabled={1 === status}
          onClick={() => dispatch(createAction(T.scanLog, { status: 1 }))}
        >
          Refresh
        </button>
      </div>
      <div>{Comp}</div>
    </div>
  );
}

function getInput(type, input) {
  if ("url" === type) {
    return (
      <a href={input} target="_blank" rel="noreferrer">
        {input}
      </a>
    );
  } else if ("file" === type) {
    const toks = input.split(",");
    return toks.length > 1 ? toks[0] : "";
  } else if ("text" === type) {
    const text = input;
    return text;
  }
}
function getCredits(status, credits) {
  //return credits;
  if (
    "scanned" === status ||
    "exporting" === status ||
    "export_failed" === status ||
    "exported" === status
  )
    return credits;
  return "";
}
function getStatus(status) {
  switch (status) {
    case "checking":
      return "Checking credits";
    case "check_failed":
      return "Checking creits failed";
    case "checked":
      return "Credits checked";
    case "scanning":
      return "Scanning";
    case "scan_failed":
      return "Scan failed";
    case "scanned":
      return "Scanned";
    case "exporting":
      return "Generating reports";
    case "export_failed":
      return "Report generation failed";
    case "exported":
      return "Completed";
    default:
      return status;
  }
}
