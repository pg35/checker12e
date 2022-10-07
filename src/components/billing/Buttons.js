import * as T from "../../reducer/action";

export default function Buttons(props) {
  const {
    state: {
      scan: { id, status, cost, failed },
      app: { balance, sandbox }
    },
    dispatch
  } = props;
  return (
    <div className="pxq_pgck_page__actions">
      <button
        onClick={() => {
          let goBack = true;
          if (!failed && "checked" !== status) {
            goBack = window.confirm(
              "Currently, cost calculation is in progress.\nAre you sure you want to go back?"
            );
          }
          if (goBack) dispatch(T.createAction(T.SCAN, { status: "" }));
        }}
      >
        Back
      </button>
      {("checked" !== status || cost <= balance) && (
        <button
          onClick={() => {
            if (
              window.confirm(
                `Plagiarism check will cost you ${
                  sandbox ? "0 credits b/c sandbox is on" : cost + " credit(s)"
                }.\nAre you sure you want to continue?`
              )
            )
              dispatch(T.createAction(T.SCAN, { status: "scan" }));
          }}
          disabled={"checked" === status ? false : true}
        >
          Check plagiarism
        </button>
      )}
      {"checked" === status && cost > balance && (
        <button
          onClick={() => {
            window.open(`${window.pxq_pgck_product_url}?pxq_pgck_sid=${id}`);
          }}
        >
          Buy credits
        </button>
      )}
    </div>
  );
}
