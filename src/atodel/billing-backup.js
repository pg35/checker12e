import { useEffect } from "react";
import Container from "../ui/Container";
import Progress from "../ui/Progress";
import * as T from "../../reducer/action";
import { useAjax } from "../../util/hooks";

function getInput(type, rawInput) {
  return "this is a long text to check for the credit check this is along text";
  return rawInput.input;
}

function Request(props) {
  const { state, dispatch } = props;
  const [response, ajaxFuncs] = useAjax(props.useAjaxArgs);
  let status = useEffect(() => {
    if (response.data) {
      props.onComplete(response.data);
    }
  }, [response]);
  let progress = 0;
  let message = props.messages[0];
  if (response.success) {
    progress = 1;
    message = props.messagess[1];
  } else if (response.fail) {
    progress = 2;
    message = `${props.messages[2]} - ${response.fail}`;
  }

  return (
    <div>
      <Progress status={progress + 1} message={message} />
    </div>
  );
}

function Check(props) {
  const { state, dispatch } = props;
  const { scan, app } = state;
  return (
    <Request
      useAjaxArgs={{
        ajax: {
          method: "POST",
          data: {
            action: "pxq_pgck_check_credits",
            text: getInput(scan, state[`${scan.type}Input`]),
            type: scan.type,
            sandbox: app.sandbox
          }
        }
      }}
      onComplete={(data) =>
        dispatch(
          T.createAction(T.SCAN, {
            id: data.scan_id,
            status: "checking"
          })
        )
      }
      messages={[
        "Submitting request",
        "Request submitted",
        "Request submission failed"
      ]}
    />
  );
}
function Checked(props) {
  return "checked";
}
function Check1(props) {
  const { state, dispatch } = props;
  const { scan, app } = state;

  const [response, ajaxFuncs] = useAjax({
    ajax: {
      method: "POST",
      data: {
        aaction: "pxq_pgck_check_credits",
        input: getInput(scan, state[`${scan.type}Input`]),
        type: scan.type,
        sandbox: app.sandbox
      }
    }
  });
  let status = useEffect(() => {
    if (response.data) {
      dispatch(
        T.createAction(T.SCAN, {
          id: response.data.scan_id,
          status: "checking"
        })
      );
    }
  }, [response]);
  let progress = 1;
  let message = "Submitting request";
  if (response.success) {
    progress = 2;
    message = "Request submitted";
  } else if (response.fail) {
    progress = 3;
    message = "Request submission failed";
  }

  return (
    <div>
      <h3>Calculating Cost</h3>
      <Progress status={progress} message={message} />
    </div>
  );
}
function Check2(props) {
  const { state, dispatch } = props;
  const { scan, app } = state;

  const [response, ajaxFuncs] = useAjax({
    ajax: {
      method: "POST",
      data: {
        action: "get_check_credits_result",
        input: getInput(scan, state[`${scan.type}Input`]),
        type: scan.type,
        sandbox: app.sandbox
      }
    }
  });
  let status = useEffect(() => {
    if (response.data) {
      dispatch(
        T.createAction(T.SCAN, {
          status: "checking"
        })
      );
    }
  }, [response]);
  let progress = 1;
  let message = "Submitting request";
  if (response.success) {
    progress = 2;
    message = "Request submitted";
  } else if (response.fail) {
    progress = 3;
    message = "Request submission failed";
  }

  return (
    <div>
      <h3>Calculating Cost</h3>
      <Progress
        status={progress}
        message={message}
        classes={["center", "stacked"]}
      />
    </div>
  );
}
export default function Billing(props) {
  const { state, dispatch } = props;
  const { scan, app } = state;

  let elem = null;
  switch (scan.status) {
    case "check":
    case "check_failed":
      elem = <Check state={state} dispatch={dispatch} />;
      break;
    case "checking":
      elem = <Checking state={state} dispatch={dispatch} />;
      break;
    case "checked":
      elem = (
        <>
          <Checked state={state} dispatch={dispatch} />
          <p>
            <button
              onClick={() =>
                dispatch(T.createAction(T.SCAN, { status: "check" }))
              }
            >
              Checked Next
            </button>
          </p>
        </>
      );
      break;

    default:
      throw new Error("Invalid status = " + scan.status);
  }
  return (
    <Container
      footer={<BillingButtons state={props.state} dispatch={dispatch} />}
    >
      <div className="pxq_pgck_page pxq_pgck_page_billing">
        <div className="pxq_pgck_page__header">
          <h3>Billing</h3>
        </div>
        <div className="pxq_pgck_page__body">{elem}</div>
      </div>
    </Container>
  );
}
function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}
function ScanInfo(props) {
  const {
    state: {
      scan: { id, type, input, status, credits },
      app: { balance, sandbox }
    }
  } = props;
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <th>Type</th>
            <td>{"url" === type ? "URL" : capitalize(type)}</td>
          </tr>
          <tr>
            <th>Input</th>
            <td>{input}</td>
          </tr>
          <tr>
            <th>Sandbox mode</th>
            <td>
              {true === sandbox ? (
                "On"
              ) : (
                <span style={{ color: "red" }}>Off</span>
              )}
            </td>
          </tr>
        </tbody>
      </table>
      {sandbox && (
        <div>
          <small>
            Sandbox mode shows expected cost.
            <br />
            No credit is charged in sandbox mode.
          </small>
        </div>
      )}
    </div>
  );
}

function BillingButtons(props) {
  const {
    state: {
      scan: { id, status, credits },
      app: { balance, sandbox }
    },
    dispatch
  } = props;
  return (
    <div className="pxq_pgck_page__actions">
      <button
        onClick={() => {
          if (
            window.confirm(
              "Currently, credit check is in progress.\nAre you sure you want to go back?"
            )
          ) {
            dispatch(T.createAction(T.SCAN, { status: "" }));
          }
        }}
      >
        Back
      </button>

      {("checked" !== status || credits <= balance) && (
        <button
          onClick={() => {
            if (
              window.confirm(
                `Plagiarism check will cost you ${
                  sandbox
                    ? "0 credits b/c sandbox is on"
                    : credits + " credit(s)"
                }.\nAre you sure you want to continue?`
              )
            )
              dispatch(T.createAction(T.SCAN, { status: "scan" }));
          }}
          disabled={"checked" === status ? false : true}
        >
          Check plagiarism
        </button>
      )}
      {"checked" === status && credits > balance && (
        <button
          onClick={() => {
            window.open(`${window.pxq_pgck_product_url}?pxq_pgck_sid=${id}`);
          }}
        >
          Buy credits
        </button>
      )}
      {"checked" === status && credits > balance && (
        <div
          msg="You don't have enough credits to start the plagiarism check"
          url={`${window.pxq_pgck_product_url}?pxq_pgck_sid=${id}`}
        />
      )}
    </div>
  );
}
