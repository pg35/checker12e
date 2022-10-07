import Request from "../util/Request";
import * as T from "../../reducer/action";

export default function Scan(props) {
  const { state, dispatch } = props;
  const { scan } = state;
  return (
    <Request
      {...props}
      useAjaxArgs={{
        ajax: {
          method: "POST",
          data: {
            action: "pxq_pgck_start_scan",
            scan_id: scan.id
          }
        }
      }}
      onComplete={(data) => {
        dispatch(
          T.createAction(T.SCAN, {
            status: "scanning"
          })
        );
        dispatch(
          T.createAction(T.APP, {
            balance: state.app.balance
          })
        );
      }}
      messages={[
        "Requesting plagiarism check",
        "Plagiarism check request submitted",
        "Plagiarism check request failed"
      ]}
    />
  );
}
