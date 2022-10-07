import * as T from "./action";

export const initialState = {
  app: {
    balance: 0,
    sandbox: true,
    welcomePopup: true,
    lowCreditsPopup: true,
    completionPopup: true
  },
  scan: {
    id: 0,
    type: "text",
    status: "",
    cost: 0,
    pdf: "",
    failed: false
  },
  scanLog: {
    status: 1,
    list: [],
    order: null,
    orderBy: null,
    filter: ""
  },
  transactionLog: {
    status: 1,
    list: [],
    order: null,
    orderBy: null,
    filter: ""
  },
  textInput: {
    input: ""
  },
  fileInput: {
    input: null,
    status: 0,
    message: "",
    dirty: false
  },
  urlInput: {
    input: "",
    status: 0,
    message: "",
    dirty: false
  }
};

export default function reducer(state, action) {
  console.log("%cBefore: ", "color:#fff;background:darkgreen");
  console.log(action, state);
  const state2 = reducer1(state, action);
  console.log("%cAfter: ", "color:orange;font-size:1.2em;font-weight:bold;");
  console.log(state2);

  return state2;
}
export function reducer1(state, action) {
  if (action.type === T.SCAN) {
    if ("checked" === state.scan.status)
      state = { ...state, app: { ...state.app, lowCreditsPopup: true } };
    else if ("exported" === state.scan.status)
      state = { ...state, app: { ...state.app, completionPopup: true } };
    if (action.data.status && action.data.status !== state.scan.status) {
      action.data.failed = false;
    }
    console.log("updated action,state", action, state);
  }
  switch (action.type) {
    case T.APP:
    case T.SCAN_LOG:
    case T.TRANSACTION_LOG:
    case T.TEXT_INPUT:
    case T.FILE_INPUT:
    case T.URL_INPUT:
    case T.SCAN:
      return {
        ...state,
        [action.type]: {
          ...state[action.type],
          ...action.data
        }
      };
    default:
      throw new Error("Invalid action.type in reducer");
  }
}
