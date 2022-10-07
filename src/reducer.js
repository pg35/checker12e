import { makeEnum } from "./util/general";

export const initialState = {
  welcomePopup: true,

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
  }
};

export const T = makeEnum([
  "1ajaxStatus",
  "1scanLog",
  "1transactionLog",
  "1welcomePopup"
]);
export function getT() {
  return T;
}
export function createAction(type, data) {
  return {
    type,
    data
  };
}
let globalDispatch = null;
export function setDispatch(dispatch) {
  globalDispatch = dispatch;
}
export function getDispatch() {
  return globalDispatch;
}
export default function reducer(state, action) {
  console.log("%cBefore: ", "color:#fff;background:darkgreen");
  console.log(state);
  const state2 = reducer1(state, action);
  console.log("%cAfter: ", "color:orange;font-size:1.2em;font-weight:bold;");
  console.log(state2);

  return state2;
}
export function reducer1(state, action) {
  console.log(action);
  switch (action.type) {
    case T.welcomePopup:
      return {
        ...state,
        welcomePopup: false
      };
    case T.ajaxStatus:
      return {
        ...state,
        ajaxStatus: action.data
      };
    case T.scanLog:
      return {
        ...state,
        scanLog: {
          ...state.scanLog,
          ...action.data
        }
      };
    case T.transactionLog:
      return {
        ...state,
        transactionLog: {
          ...state.transactionLog,
          ...action.data
        }
      };
    default:
      throw new Error("Invalid action.type in reducer");
  }
}
