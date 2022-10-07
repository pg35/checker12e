import * as T from "../../reducer/action";
export default function SandboxInput(props) {
  const {
    state: {
      app: { sandbox }
    },
    dispatch
  } = props;

  return (
    <div className="pxq_pgck_row">
      <label>
        <input
          type="checkbox"
          checked={sandbox}
          onChange={() =>
            dispatch(
              T.createAction(T.APP, {
                sandbox: !sandbox
              })
            )
          }
        />{" "}
        Enable sandbox mode
      </label>
    </div>
  );
}
