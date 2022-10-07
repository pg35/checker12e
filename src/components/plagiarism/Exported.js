import { BuyCreditsPopup } from "../ui/Popup";
import * as T from "../../reducer/action";

export default function Exported(props) {
  const { state, dispatch } = props;
  const { scan, app } = state;
  const classes = ["row", "success", "large"];

  return (
    <div>
      <div className={classes.map((x) => `pxq_pgck_${x}`).join(" ")}>
        <h3>Completed</h3>
        <p>Report and PDF are ready</p>
      </div>
      {app.completionPopup && (
        <BuyCreditsPopup
          heading="Buy credits"
          msg="Get text, documents (local or online) and web pages scanned for plagiarism."
          url={`${window.pxq_pgck_product_url}`}
          handleClose={() =>
            dispatch(
              T.createAction(T.APP, {
                completionPopup: false
              })
            )
          }
        />
      )}
    </div>
  );
}
