import { useState, useEffect, useReducer } from "react";
import "./styles.css";
import reducer, { initialState } from "./reducer/reducer";
import * as T from "./reducer/action";
import { useAjax } from "./util/hooks";
import Home from "./components/pages/Home";

export function App1(props) {
  const [response, funcs, counter, isStarted] = useAjax({
    repeatCount: 100,
    repeatDelay: 2000
  });
  console.log("app", counter, isStarted);
  return (
    <div>
      <div>{counter}</div>
      <button
        onClick={() => {
          funcs.start();
          funcs.setAjaxArgs(1);
        }}
      >
        Start
      </button>
      <button onClick={() => funcs.stop()}>Stop</button>
    </div>
  );
}
function goToStep(dispatch, status) {
  dispatch(T.createAction(T.SCAN, { status }));
}
function Test(props) {
  return <button onClick={() => goToStep(props.dispatch, 1)}>Back</button>;
}
export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    scan: { status }
  } = state;

  let elem = null;
  switch (status) {
    case 1:
      elem = (
        <Home
          state={state}
          dispatch={dispatch}
          onComplete={() => goToStep(dispatch, 2)}
        />
      );
      break;
    case 2:
      elem = <Test dispatch={dispatch} />;
      break;
    default:
      throw new Error("invalid status");
  }
  return <div className="pxq_pgck">{elem}</div>;
}
