import { useState, useEffect, useReducer } from "react";
import "./styles.css";
import reducer, { initialState } from "./reducer/reducer";
import ScanList from "./components/tables/ScanListTable";
import Transactions from "./components/tables/TransactionListTable";

export function ScansApp() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div className="pxq_pgck">
      <ScanList state2={state} dispatch={dispatch} />
    </div>
  );
}

export function TransApp() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div className="pxq_pgck">
      <Transactions state2={state} dispatch={dispatch} />
    </div>
  );
}
