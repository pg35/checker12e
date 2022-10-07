import TextInput from "../home/TextInput";
import FileInput from "../home/FileInput";
import URLInput from "../home/URLInput";
import * as T from "../../reducer/action";

export default function Home(props) {
  const {
    state: {
      scan: { type },
      app: { balance, sandbox }
    },
    dispatch
  } = props;
  const handleTypeChange = (e) =>
    dispatch(T.createAction(T.SCAN, { type: e.target.value }));

  const allTypes = {
    text: "Enter text",
    file: "Upload file",
    url: "Enter URL"
  };
  const typeElems = Object.keys(allTypes).map((k) => (
    <label key={k}>
      <input
        type="radio"
        name="type"
        value={k}
        checked={k === type}
        onChange={handleTypeChange}
      />{" "}
      {allTypes[k]}
    </label>
  ));

  let Comp = TextInput;
  if ("file" === type) Comp = FileInput;
  else if ("url" === type) Comp = URLInput;

  return (
    <div className="pxq_pgck_home">
      <div className="pxq_pgck_types">{typeElems}</div>
      <Comp
        state={props.state}
        dispatch={dispatch}
        onComplete={props.onComplete}
      />
    </div>
  );
}
