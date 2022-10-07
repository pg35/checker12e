import Spinner from "./Spinner";
export default function Loading(props) {
  const { layout = "row" } = props;
  if ("row" === layout) {
    return (
      <span className="pxq_pgck_loading pxq_pgck_row">
        <span>{props.message ? props.message : "Loading..."}</span>
        <span>
          <Spinner />
        </span>
      </span>
    );
  }
  return (
    <span className="pxq_pgck_loading pxq_pgck_stacked">
      <span>
        <Spinner />
      </span>
      <span>{props.message ? props.message : "Loading..."}</span>
    </span>
  );
}
