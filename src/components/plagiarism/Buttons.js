import * as T from "../../reducer/action";

export default function Buttons(props) {
  const {
    state: {
      scan: { id, status, failed }
    },
    dispatch
  } = props;
  return (
    <div className="pxq_pgck_page__actions">
      <button
        onClick={() => {
          let goBack = true;
          if (!failed && "exported" !== status) {
            goBack = window.confirm(
              'Currently, plagiarism check is in progress.\nAre you sure you want to start a new plagiarism check?\nCurrent plagiarism check will keep running in the background.\nYou can view your plagiarism checks from "Plagiarism checks" page.'
            );
          }
          if (goBack) dispatch(T.createAction(T.SCAN, { status: "" }));
        }}
      >
        New plagiarism check
      </button>

      <button
        onClick={() => {
          const url = window.pxq_pgck_report_url + "?scan_id=" + id;
          window.open(url, "_blank");
        }}
        disabled={"exported" === status ? false : true}
      >
        View report
      </button>
      <button
        onClick={() => {
          const url = props.state.scan.pdf.replace("{SCANID}", id);
          window.open(url, "_blank");
        }}
        disabled={"exported" === status ? false : true}
      >
        Download PDF
      </button>
    </div>
  );
}
