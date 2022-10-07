import Container from "../ui/Container";
import Check from "../billing/Check";
import Checking from "../billing/Checking";
import Checked from "../billing/Checked";
import Buttons from "../billing/Buttons";
import ScanInfo from "../util/ScanInfo";

export default function Billing(props) {
  const { state, dispatch } = props;
  const { scan, app } = state;

  let elem = null;
  switch (scan.status) {
    case "check":
    case "check_failed":
      elem = <Check state={state} dispatch={dispatch} />;
      break;
    case "checking":
      elem = <Checking state={state} dispatch={dispatch} />;
      break;
    case "checked":
      elem = <Checked state={state} dispatch={dispatch} />;
      break;
    default:
      throw new Error("Invalid status = " + scan.status);
  }
  return (
    <Container footer={<Buttons state={props.state} dispatch={dispatch} />}>
      <div className="pxq_pgck_page pxq_pgck_page_billing">
        <div className="pxq_pgck_page__header">
          <h2>Billing</h2>
        </div>
        <div className="pxq_pgck_page__body">
          {elem}
          <ScanInfo state={state} dispatch={dispatch} />
        </div>
      </div>
    </Container>
  );
}
