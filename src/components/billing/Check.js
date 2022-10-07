import Request from "../util/Request";
import * as T from "../../reducer/action";
import { getSentence } from "../../util/general";

function getInput(state) {
  const type = state.scan.type;
  const input = state[`${type}Input`].input;
  if ("url" === type) return input;
  if ("file" === type) return input.join(",");
  return getSentence(input);
}

export default function Check(props) {
  const { state, dispatch } = props;
  const { scan, app } = state;
  return (
    <Request
      {...props}
      useAjaxArgs={{
        ajax: {
          method: "POST",
          data: {
            action: "pxq_pgck_check_credits",
            text: getInput(state),
            type: scan.type,
            sandbox: app.sandbox
          }
        }
      }}
      onComplete={(data) =>
        dispatch(
          T.createAction(T.SCAN, {
            id: data.scan_id,
            status: "checking"
          })
        )
      }
      messages={[
        "Requesting cost calculation",
        "Cost calculation request submitted",
        "Cost calculation request failed"
      ]}
    />
  );
}
