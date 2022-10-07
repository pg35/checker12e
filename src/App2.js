import { useState, useEffect, useReducer } from "react";
import Home from "./components/pages/Home";
import Billing from "./components/pages/Billing";
import Plagiarism from "./components/pages/Plagiarism";
import ScanListTable from "./components/tables/ScanListTable";
import TransactionListTable from "./components/tables/TransactionListTable";
import MenuBar from "./components/ui/MenuBar";
import reducer, { initialState } from "./reducer/reducer";
import * as T from "./reducer/action";
import { useAjax } from "./util/hooks";

import "./styles.css";
import Progress from "./components/ui/Progress";
import Check from "./components/billing/Check";
import Checking from "./components/billing/Checking";
import Checked from "./components/billing/Checked";
import ScanInfo from "./components/util/ScanInfo";
import ExpandableText from "./components/util/ExpandableText";
import Buttons from "./components/plagiarism/Buttons";
import { Overlay, Popup, BuyCreditsPopup } from "./components/ui/Popup";
const items = [
  {
    key: 0,
    label: (
      <span>
        &larr; <small>Go back</small>
      </span>
    )
  },
  { key: 1, label: "Plagiarism checks" },
  { key: 2, label: "Transactions" }
];
export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  /*return (
    <div>
      <Checked state={state} dispatch={dispatch} />
      <ScanInfo state={state} dispatch={dispatch} />
    </div>
  );
  */

  const {
    scan: { status },
    app: { balance, welcomePopup }
  } = state;
  const [activeItem, setActiveItem] = useState(0);

  let elem = null;
  switch (status) {
    case "":
      if (1 === activeItem)
        elem = <ScanListTable state={state} dispatch={dispatch} />;
      else if (2 === activeItem)
        elem = <TransactionListTable state={state} dispatch={dispatch} />;
      else
        elem = (
          <Home
            state={state}
            dispatch={dispatch}
            onComplete={() =>
              dispatch(
                T.createAction(T.SCAN, {
                  id: 0,
                  status: "check",
                  cost: 0,
                  pdf: "",
                  failed: false
                })
              )
            }
          />
        );
      break;
    case "check":
    case "check_failed":
    case "checking":
    case "checked":
      elem = <Billing state={state} dispatch={dispatch} />;
      break;
    case "scan":
    case "scanning":
    case "exporting":
    case "exported":
      elem = <Plagiarism state={state} dispatch={dispatch} />;
      break;
    default:
      throw new Error("invalid status");
  }
  window.pxq_pgck_login_url = "http://goodtogo.cc/wp-login.php";
  window.pxq_pgck_register_url =
    "http://goodtogo.cc/wp-login.php?action=register";
  window.pxq_pgck_main_url = "http://goodtogo.cc/plagiarism-checker";
  window.pxq_pgck_report_url = "http://goodtogo.cc/plagiarism-report";
  window.pxq_pgck_product_url = "http://goodtogo.cc/product/credits";
  window.pxq_pgck_pdf_url =
    "http://goodtogo.cc/_pxq_pgck_/report/imran/{SCANID}/pdf-report.pdf?download ";
  window.pxq_pgck_is_wp_user = 0;
  window.pxq_pgck_nid = 0;
  window.pxq_pgck_signup_gift = 0;
  window.pxq_pgck_balance = 2;
  useEffect(() => {
    dispatch(
      T.createAction(T.APP, {
        balance: window.pxq_pgck_balance
      })
    );
  }, []);
  return (
    <div id="pxq_pgck">
      {welcomePopup && (window.pxq_pgck_nid || window.pxq_pgck_signup_gift) ? (
        <BuyCreditsPopup
          heading="Welcome"
          msg={
            window.pxq_pgck_nid ? (
              <div>
                Thank you for registering with us. Your account is ready. Please{" "}
                <a href={window.pxq_pgck_login_url}>Login</a>
                {window.pxq_pgck_signup_gift
                  ? ` to use your registration gift of ${window.pxq_pgck_signup_gift}
                    credits.`
                  : "."}
              </div>
            ) : (
              <div>
                <a href={window.pxq_pgck_register_url}>Register</a> now and get
                a gift of {window.pxq_pgck_signup_gift} credits. If you are
                already registered, please{" "}
                <a href={window.pxq_pgck_login_url}>Login</a>.
              </div>
            )
          }
          url={`${window.pxq_pgck_product_url}`}
          handleClose={() =>
            dispatch(
              T.createAction(T.APP, {
                welcomePopup: false
              })
            )
          }
        />
      ) : null}
      <MenuBar
        right={
          <span>
            <strong>Credits: </strong>
            {balance}
          </span>
        }
        items={
          !status
            ? 0 === activeItem
              ? items.filter((x) => x.key > 0)
              : items
            : []
        }
        onItemClick={(obj) => setActiveItem(obj.key)}
        activeItem={activeItem}
      />

      {elem}
    </div>
  );
}
