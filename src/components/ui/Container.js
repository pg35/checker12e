export default function Container(props) {
  return (
    <div className="pxq_pgck_container">
      <div className="pxq_pgck_container__body">{props.children}</div>
      <div className="pxq_pgck_container__footer">{props.footer}</div>
    </div>
  );
}
