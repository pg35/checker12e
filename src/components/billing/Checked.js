import { BuyCreditsPopup } from "../ui/Popup";
import * as T from "../../reducer/action";
export default function Checked(props) {
  const { state, dispatch } = props;
  const { scan, app } = state;
  const classes = ["bold"];
  if (scan.cost > app.balance) classes.push("error");
  else classes.push("success");
  return (
    <div>
      <table className="pxq_pgck_table pxq_pgck_table_info">
        <tbody>
          <tr>
            <th>Your credits</th>
            <td>{app.balance}</td>
          </tr>
          <tr>
            <th>
              Plagiarism check cost <small>(credits)</small>
            </th>
            <td className={classes.map((x) => `pxq_pgck_${x}`).join(" ")}>
              {scan.cost}
            </td>
          </tr>
        </tbody>
      </table>
      {app.lowCreditsPopup && scan.cost > app.balance && (
        <BuyCreditsPopup
          heading="Insufficient credits"
          msg="You don't have enough credits to start plagiarism check. No worries, it is super easy to buy credits."
          url={`${window.pxq_pgck_product_url}?pxq_pgck_sid=${scan.id}`}
          handleClose={() =>
            dispatch(
              T.createAction(T.APP, {
                lowCreditsPopup: false
              })
            )
          }
        />
      )}
    </div>
  );
}
