import Loading from "./Loading";

export default function Progress(props) {
  const { status, message, classes = [] } = props;
  let elem = null;
  if (1 === status) {
    elem = (
      <Loading
        layout={classes.includes("stacked") ? "stacked" : "row"}
        message={message}
      />
    );
  } else if (2 === status) {
    elem = <span className="pxq_pgck_success">{message}</span>;
  } else if (3 === status) {
    elem = <span className="pxq_pgck_error">{message}</span>;
  } else throw new Error("Unknow status " + status);
  return (
    <p
      className={`pxq_pgck_progress ${classes
        .map((x) => `pxq_pgck_${x}`)
        .join(" ")}`}
    >
      {elem}
    </p>
  );
}
