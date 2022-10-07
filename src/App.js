import { useState, useEffect, useReducer } from "react";
import Main from "./components/Main";
import CreditCheck from "./components/CreditCheck";
import Scan from "./components/Scan";
import { Header, MenuItem, MenuItem1 } from "./components/styled";
import ScanList from "./components/tables/ScanListTable";
import Transactions from "./components/tables/TransactionListTable";
import { Popup } from "./components/Popup";
import "./styles.css";
import { BuyCreditsPopup } from "./components/Popup";
import reducer, { initialState } from "./reducer/reducer";
import * as T from "./reducer/action";

export default function App() {
  const [state2, dispatch] = useReducer(reducer, initialState);

  const [state, setState] = useState({
    step: 1,
    status: 1,
    type: "text",
    text: "",
    rawText: "",
    rawFile: null,
    rawUrl: "",
    urlValidation: 0,
    sandbox: true,
    balance: 0,
    clean: false,
    scanList: [],
    scanListSort: null
  });
  useEffect(() => {
    const input = '{"org_name":"abc.txt", "upload_name":"abc1.txt"}';
    window.pxq_pgck_login_url = "http://goodtogo.cc/wp-login.php";
    window.pxq_pgck_register_url =
      "http://goodtogo.cc/wp-login.php?action=register";
    window.pxq_pgck_main_url = "http://goodtogo.cc/plagiarism-checker";
    window.pxq_pgck_report_url = "http://goodtogo.cc/plagiarism-report";
    window.pxq_pgck_product_url = "http://goodtogo.cc/product/credits";
    window.pxq_pgck_pdf_url =
      "http://goodtogo.cc/_pxq_pgck_/report/imran/{SCANID}/pdf-report.pdf?download ";
    window.pxq_pgck_is_wp_user = 0;
    window.pxq_pgck = {
      product_url: "https://google.com",
      balance: 5,
      nid: 1,
      scan: JSON.stringify({
        scan_id: "9999",
        type: "url",
        text: "https:/google.com",
        credits: 1,
        scanStatus: "exported"
        //rawInput: "this is a long raw text written\n for a raw",
        //rawInput: '{"org_name":"abc.txt", "upload_name":"abc1.txt"}'
      }),
      scan: null
    };
    let newState = {
      ...state,
      balance: window.pxq_pgck.balance,
      //product_url: window.pxq_pgck.product_url
      nid: window.pxq_pgck.nid
    };
    //console.log(window.pxq_pgck);

    if (window.pxq_pgck.scan) {
      var scan = JSON.parse(window.pxq_pgck.scan);
      if ("file" === scan.type) {
        var toks = scan.text.split(",");
        scan.text = { org_name: toks[0], upload_name: toks[1] };
      }
      newState = { ...newState, ...scan, step: 2, status: 2, clean: true };
    }
    setState(newState);
    window.pxq_pgck_bk = window.pxq_pgck;
    setTimeout(() => {
      window.pxq_pgck = null;
    }, 0);
    return () => {
      //console.log("app unmounted");
    };
  }, []);
  //console.log("app", state);
  let Comp = null;
  switch (state.step) {
    case 1:
      Comp = Main;
      break;
    case 2:
      Comp = CreditCheck;
      break;
    case 3:
      Comp = Scan;
      break;
    case -1:
      Comp = ScanList;
      break;
    case -2:
      Comp = Transactions;
      break;
    default:
      throw new Error("Unknown step");
  }

  return (
    <div className="App">
      {!window.pxq_pgck_is_wp_user && !state.scan_id && state2.welcomePopup && (
        <Popup
          show={state2.welcomePopup}
          onClose={(e) => {
            dispatch(T.createAction(T.WELCOME_POPUP, false));
          }}
        >
          <div>
            <h2>Free credits</h2>

            {state.nid ? (
              <div>
                <p>Thank you for registering with us. Your account is ready.</p>
                <p>
                  Please <a href={window.pxq_pgck_login_url}>Login</a>
                  {window.pxq_pgck_signup_gift
                    ? ` to use your registration gift of ${window.pxq_pgck_signup_gift} credits.`
                    : "."}
                </p>
              </div>
            ) : (
              <div>
                <p>
                  <a href={window.pxq_pgck_register_url}>Register</a> now and
                  get a gift of 4 credits.
                </p>
                <p>
                  If you are already registered, please{" "}
                  <a href={window.pxq_pgck_login_url}>Login</a>.
                </p>
              </div>
            )}

            <p style={{ marginTop: "30px" }}>
              Get your text, documents (local or online) and web pages scanned
              for plagiarism.
            </p>
            <p>
              <button
                style={{ marginTop: "30px", padding: "10px 20px" }}
                onClick={(e) => window.open(window.pxq_pgck_product_url)}
              >
                Buy Credits
              </button>
            </p>
          </div>
        </Popup>
      )}
      <Header>
        <span style={{ float: "right", paddingTop: "5px" }}>
          <strong>Credits: </strong>
          {state.balance}
        </span>
        {state.step < 2 && (
          <>
            {state.step < 1 && (
              <MenuItem
                href="#"
                onClick={() =>
                  setState({
                    ...state,
                    step: 1
                  })
                }
              >
                &larr; <small>Go back</small>
              </MenuItem>
            )}
            <MenuItem
              href="#"
              onClick={() =>
                setState({
                  ...state,
                  step: -1
                })
              }
              active={-1 === state.step}
            >
              Plagiarism checks
            </MenuItem>
            <MenuItem
              href="#"
              onClick={() =>
                setState({
                  ...state,
                  step: -2
                })
              }
              active={-2 === state.step}
            >
              Transactions
            </MenuItem>
          </>
        )}
      </Header>
      <Comp
        state={state}
        setState={setState}
        state2={state2}
        dispatch={dispatch}
      />
    </div>
  );
}
