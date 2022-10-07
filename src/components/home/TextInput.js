import Container from "../ui/Container";
import SandboxInput from "./SandboxInput";
import * as T from "../../reducer/action";
import { countWords, countChars } from "../../util/general";

export default function TextInput(props) {
  const {
    state: {
      textInput: { input }
    },
    dispatch,
    onComplete
  } = props;
  const charCount = countChars(input);
  const wordCount = countWords(input);

  function handleChange(e) {
    dispatch(
      T.createAction(T.TEXT_INPUT, {
        input: e.target.value
      })
    );
  }

  return (
    <Container
      footer={
        <button
          disabled={countChars(input) < 30 || countWords(input) < 6}
          onClick={onComplete}
        >
          Next
        </button>
      }
    >
      <div className="pxq_pgck_input pxq_pgck_input_text">
        <div className="pxq_pgck_input__header">
          <label className="pxq_pgck_label" htmlFor="pxq_pgck_url_input">
            Please enter text to check plagiarism
          </label>{" "}
          <small className="pxq_pgck_help">
            (At least 30 characters and 6 words)
          </small>
        </div>
        <div className="pxq_pgck_input__body">
          <div>
            <textarea
              id="pxq_pgck_text_input"
              value={input}
              onChange={handleChange}
              placeholder="Enter at least 30 characters and 6 words"
            ></textarea>
          </div>
          <div className="pxq_pgck_row">
            <small>
              <span>
                <strong>Characters:</strong>{" "}
                <span
                  className={`pxq_pgck_${charCount < 30 ? "error" : "success"}`}
                >
                  {charCount}
                </span>
              </span>
              &nbsp;&nbsp;&nbsp;
              <span>
                <strong>Words:</strong>{" "}
                <span
                  className={`pxq_pgck_${wordCount < 6 ? "error" : "success"}`}
                >
                  {wordCount}
                </span>
              </span>
            </small>
          </div>
          <SandboxInput {...props} />
        </div>
      </div>
    </Container>
  );
}
