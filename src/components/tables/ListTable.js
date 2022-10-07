import { useEffect } from "react";
import Progress from "../ui/Progress";
import { doAjax } from "../../util/ajax";
import { createAction } from "../../reducer/action";

export default function ListTable(props) {
  const {
    dispatch,
    list,
    actionType,
    status,
    ajaxKey,
    ajaxFailMsg,
    renderTableBody,
    renderTableHead,
    filter,
    onLoaded,
    colsCount
  } = props;
  console.log("props", list, status);
  function loadList() {
    return doAjax(
      { data: { action: ajaxKey } },
      (data) => {
        if (data.success) {
          console.log("list size", data.data.list.length);
          dispatch(
            createAction(actionType, {
              list: data.data.list,
              status: 2
            })
          );
          onLoaded(data);
        }
      },
      (textStatus) => {
        console.log("ajax error", textStatus);
        if ("abort" === textStatus) {
          console.log("listtable aborting jaax");
          return;
        }
        dispatch(createAction(actionType, { list: null, status: 3 }));
      }
    );
  }
  useEffect(() => {
    if (2 === status || 3 === status) return;
    const xhr = loadList();
    return () => {
      if (xhr) {
        console.log("unmounting listable " + actionType);
        xhr.abort();
      }
    };
  }, [status]);

  let Comp = null;
  if (1 === status || 3 === status) {
    Comp = (
      <Progress
        status={status}
        message={3 === status ? ajaxFailMsg : "Loading"}
        classes={["stacked", "center", "large"]}
      />
    );
  }
  //} else if (3 === status) {
  //    Comp = <ErrorMessage>{ajaxFailMsg}</ErrorMessage>;
  // } else
  if (2 === status) {
    const items = list.filter(
      (obj) => "draft" !== obj.status && "pending" !== obj.status
    );

    let tbody = null;
    if (!items.length) {
      tbody = (
        <tr>
          <td colSpan={colsCount}>You don't have any entries.</td>
        </tr>
      );
    } else {
      tbody = renderTableBody(items);
    }
    Comp = (
      <div className="pxq_pgck_wrap">
        <table
          className={`pxq_pgck_table_list pxq_pgck_table--${
            items.length ? "rows" : "empty"
          }`}
        >
          <thead>{renderTableHead(items)}</thead>
          <tbody>{tbody}</tbody>
        </table>
      </div>
    );
  }

  return (
    <div>
      <div className="pxq_pgck_table_list__refresh">
        <button
          disabled={1 === status}
          onClick={() => dispatch(createAction(actionType, { status: 1 }))}
        >
          Refresh
        </button>
      </div>
      <div className="pxq_pgck_table_list__filter">{filter}</div>
      <div>{Comp}</div>
    </div>
  );
}
