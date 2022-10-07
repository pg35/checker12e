export default function MenuBar(props) {
  return (
    <div className="pxq_pgck_menu">
      <div>
        {props.items.map((obj) => (
          <a
            key={obj.key}
            className={`pxq_pgck_menu_item ${
              obj.key === props.activeItem ? "pxq_pgck_menu_item--active" : ""
            }`}
            href="#"
            onClick={() => props.onItemClick(obj)}
          >
            {obj.label}
          </a>
        ))}
      </div>
      <div>{props.right}</div>
    </div>
  );
}
