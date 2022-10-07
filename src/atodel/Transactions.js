import { useEffect } from "react";
import Loading from "./Loading";
import { ErrorMessage } from "./styled";
import { ajaxGet as doAjax2, aysncUpdateState } from "../util/ajax";
import { T, createAction } from "../reducer";
import TransactionListTable from "./tables/TransactionListTable";

export default function TransactionList(props) {
  return <TransactionListTable {...props} />;
}
export function TransactionList2(props) {
  const {
    dispatch,
    state2: {
      transactionLog: { list, status }
    }
  } = props;
  function loadList() {
    return doAjax2(
      { action: "pxq_pgck_get_transactions1" },
      (data) => {
        if (data.success) {
          console.log("list size", data.data.list.length);
          dispatch(
            createAction(T.transactionLog, {
              list: data.data.list,
              status: 2
            })
          );
          props.setState({ ...props.state, balance: data.data.balance });
        }
      },
      (textStatus) => {
        if ("abort" === textStatus) {
          console.log("translog aborting jaax");
          return;
        }
        dispatch(createAction(T.transactionLog, { items: null, status: 2 }));
      }
    );
  }
  useEffect(() => {
    if (2 === status) return;
    dispatch(createAction(T.transactionLog, { status: 1 }));
    const xhr = loadList();
    return () => {
      if (xhr) {
        console.log("unmounting translog");
        xhr.abort();
      }
    };
  }, [status]);

  let Comp = null;
  if (1 === status) {
    Comp = <Loading />;
  } else if (3 === status) {
    Comp = (
      <ErrorMessage>Failed to load transactions. Please refresh!</ErrorMessage>
    );
  } else if (2 === status) {
    const items = list.filter(
      (obj) => "draft" !== obj.status && "pending" !== obj.status
    );
    let tbody = null;
    if (!items.length) {
      tbody = (
        <tr>
          <td colSpan={6} style={{ textAlign: "center", padding: "40px 30px" }}>
            You don't have any transactions.
          </td>
        </tr>
      );
    } else {
      tbody = items.map((obj) => (
        <tr key={obj.id}>
          <td key="id">{obj.id}</td>
          <td key="date">{obj.created_at}</td>
          <td key="detail">{obj.detail}</td>
          <td key="credits">
            <span style={{ color: "credit" === obj.status ? "green" : "red" }}>
              {"credit" === obj.status ? "+" : "-"}

              {obj.credits}
            </span>
          </td>
        </tr>
      ));
    }
    Comp = (
      <table style={{ textAlign: "left", width: "100%" }}>
        <thead>
          <tr>
            <th key="id">ID</th>
            <th key="date">Date</th>
            <th key="detail">Description</th>
            <th key="credits">Credits</th>
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
          onClick={() =>
            dispatch(createAction(T.transactionLog, { status: 1 }))
          }
        >
          Refresh
        </button>
      </div>
      <div>{Comp}</div>
    </div>
  );
}
