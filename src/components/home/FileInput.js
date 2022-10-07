import React, { useEffect } from "react";
import Container from "../ui/Container";
import Progress from "../ui/Progress";
import SandboxInput from "./SandboxInput";
import * as T from "../../reducer/action";
import { useAjax } from "../../util/hooks";

export default function FileInput(props) {
  const {
    state: {
      fileInput: { status, message, dirty },
      app: { sandbox }
    },
    dispatch,
    onComplete
  } = props;
  const ref = React.createRef();
  const [response, ajaxFuncs] = useAjax();
  useEffect(() => {
    if (2 !== status) {
      dispatch(
        T.createAction(T.FILE_INPUT, {
          input: null,
          status: 0,
          message: "",
          dirty: false
        })
      );
    }
  }, []);
  useEffect(() => {
    if (response.data) {
      dispatch(
        T.createAction(T.FILE_INPUT, {
          input: [response.data.org_name, response.data.upload_name],
          status: 2,
          message: (
            <span>
              Uploaded <strong>{`${response.data.org_name}`}</strong>
            </span>
          ),
          dirty: true
        })
      );
      props.onComplete();
    } else if (response.fail) {
      dispatch(
        T.createAction(T.FILE_INPUT, {
          status: 3,
          message: `Failed to upioad file: ${response.fail}`,
          dirty: true
        })
      );
    }
  }, [response]);

  function handleNextBtn() {
    if (2 === status) {
      return onComplete();
    }
    dispatch(
      T.createAction(T.FILE_INPUT, {
        input: null,
        status: 1,
        message: "Uploading file...",
        dirty: false
      })
    );
    var formData = new FormData();
    formData.append("action", "pxq_pgck_upload_file");
    formData.append("pxq_pgck", ref.current.files[0]);
    const args = {
      data: formData,
      type: "POST",
      dataType: "json",
      processData: false,
      contentType: false
    };
    ajaxFuncs.start(args);
  }
  function dispatchError(message) {
    return dispatch(
      T.createAction(T.FILE_INPUT, {
        input: null,
        message,
        status: 3,
        dirty: false
      })
    );
  }
  function handleChange(e) {
    const files = ref.current.files;
    if (!files.length) return;
    if (!files.length || files.length > 1) {
      return dispatchError("Please select one file ");
    }
    const ext = getFileExt(files[0].name);
    if (!validFileType(files[0])) {
      return dispatchError(
        ext ? `${ext} file is not allowed` : "This file type is not allowed"
      );
    }
    if (!validFileSize(files[0])) {
      return dispatchError(
        `File is too large. Max size for ${
          ext ? ext : "this type of "
        } file is ${formatFileSize(maxFileSizes[files[0].type])}`
      );
    }
    dispatch(
      T.createAction(T.FILE_INPUT, {
        input: null,
        status: 0,
        message: "",
        dirty: true
      })
    );
  }
  return (
    <Container
      footer={
        <button disabled={!dirty} onClick={() => handleNextBtn()}>
          Next
        </button>
      }
    >
      <div className="pxq_pgck_input pxq_pgck_input_file">
        <div className="pxq_pgck_input__header">
          <label className="pxq_pgck_label" htmlFor="pxq_pgck_file_input">
            Please upload a file to check plagiarism
          </label>{" "}
          <small className="pxq_pgck_help">
            (.txt, .htm, .html, .pdf, .doc, .docx, .ppt)
          </small>
        </div>
        <div className="pxq_pgck_input__body">
          <div className="pxq_pgck_row">
            <input
              id="pxq_pgck_file_input"
              type="file"
              ref={ref}
              onChange={handleChange}
              accept=".txt, .htm, .html, .pdf, .doc, .docx, .ppt, text/plain,  text/html,  application/pdf,  application/msword, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              disabled={1 === status}
            />
          </div>
          <div className="pxq_pgck_row">
            {status > 0 && <Progress status={status} message={message} />}
          </div>
          <SandboxInput {...props} />
        </div>
      </div>
    </Container>
  );
}
const fileTypes = [
  "text/plain",
  "text/html",
  "application/pdf",
  "application/msword",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];
const maxFileSizes = {
  "text/plain": 5242880,
  "text/html": 3145728,
  "application/pdf": 26214400,
  "application/msword": 26214400,
  "application/vnd.ms-powerpoint": 26214400,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": 26214400
};

function validFileType(file) {
  console.log("validfiletype", file, file.type);
  return !file.type ? true : fileTypes.includes(file.type);
}
function validFileSize(file) {
  return !maxFileSizes[file.type] ? true : file.size <= maxFileSizes[file.type];
}
function formatFileSize_old(number) {
  if (number < 1024) {
    return `${number} bytes`;
  } else if (number >= 1024 && number < 1048576) {
    return `${(number / 1024).toFixed()} KB`;
  } else if (number >= 1048576) {
    return `${(number / 1048576).toFixed()} MB`;
  }
}
function formatFileSize(number) {
  return (number / 1048576).toFixed(4).replace(/[.]0000$/, "") + " MB";
}
function getFileExt(name) {
  var re = /(?:\.([^.]+))?$/;
  return re.exec(name)[1];
}
