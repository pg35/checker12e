import Container from "../ui/Container";
import Scan from "../plagiarism/Scan";
import Scanning from "../plagiarism/Scanning";
import Exporting from "../plagiarism/Exporting";
import Exported from "../plagiarism/Exported";
import Buttons from "../plagiarism/Buttons";
import ScanInfo from "../util/ScanInfo";

export default function Plagiarism(props) {
  const { state, dispatch } = props;
  const { scan } = state;

  let elem = null;
  switch (scan.status) {
    case "scan":
    case "scan_failed":
      elem = <Scan state={state} dispatch={dispatch} />;
      break;
    case "scanning":
      elem = <Scanning state={state} dispatch={dispatch} />;
      break;
    case "exporting":
      elem = <Exporting state={state} dispatch={dispatch} />;
      break;
    case "exported":
      elem = <Exported state={state} dispatch={dispatch} />;
      break;
    default:
      throw new Error("Invalid status = " + scan.status);
  }
  return (
    <Container footer={<Buttons state={props.state} dispatch={dispatch} />}>
      <div className="pxq_pgck_page pxq_pgck_page_plagiarism">
        <div className="pxq_pgck_page__header">
          <h2>Plagiarism check</h2>
        </div>
        <div className="pxq_pgck_page__body">
          {elem}
          <ScanInfo state={state} dispatch={dispatch} />
        </div>
      </div>
    </Container>
  );
}
