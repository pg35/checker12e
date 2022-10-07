import ExpandableText from "../util/ExpandableText";
import { capitalize } from "../../util/general";
import { getSentence } from "../../util/general";

function getFormattedInput(type, input) {
  //const type = state.scan.type;
  //const input = state[`${type}Input`].input;
  if ("url" === type)
    return (
      <a href={input} target="_blank" rel="noreferrer">
        {input}
      </a>
    );
  if ("file" === type) {
    return input[0];
    return (
      <a href={"#"} target="_blank" rel="noreferrer">
        {input[1]}
      </a>
    );
  }
  return <ExpandableText text={getSentence(input)} />;
}
export default function ScanInfo(props) {
  const {
    state: {
      scan: { type },
      app: { sandbox }
    }
  } = props;
  return (
    <div>
      <table className="pxq_pgck_table pxq_pgck_table_info">
        <tbody>
          <tr>
            <th>Type</th>
            <td>{"url" === type ? "URL" : capitalize(type)}</td>
          </tr>
          <tr>
            <th>Input</th>
            <td>
              {getFormattedInput(type, props.state[`${type}Input`].input)}
            </td>
          </tr>
          <tr>
            <th>Sandbox mode</th>
            <td className={`pxq_pgck_${sandbox ? "success" : "error"}`}>
              {sandbox ? "On" : "Off"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
