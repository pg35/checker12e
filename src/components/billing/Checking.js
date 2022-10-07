import Request from "../util/Request";
import * as T from "../../reducer/action";

export default function Checking(props) {
  const { state, dispatch, repeatCount = 100 } = props;
  const { scan } = state;
  return (
    <Request
      {...props}
      useAjaxArgs={{
        ajax: {
          data: {
            action: "pxq_pgck_get_check_credits_result",
            scan_id: scan.id
          }
        },
        repeatCount: repeatCount
      }}
      repeatCount={repeatCount}
      onComplete={(data, stopAjax) => {
        if (!data.credits) return;
        dispatch(
          T.createAction(T.SCAN, {
            status: "checked",
            cost: data.credits
          })
        );
        stopAjax();
      }}
      messages={[
        "Calculating cost",
        "Cost calculated",
        "Cost calculation timed out"
      ]}
    />
  );
}
