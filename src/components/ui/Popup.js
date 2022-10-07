import React, { useEffect, useState } from "react";
import styled from "styled-components";

export function Overlay(props) {
  return (
    <div className="pxq_pgck_overlay">
      <div
        className="pxq_pgck_overlay__body"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="pxq_pgck_overlay__close" onClick={props.handleClose}>
          x
        </span>
        {props.children}
      </div>
    </div>
  );
}

export function Popup(props) {
  function escFunction(event) {
    if (event.key === "Escape" || "click" === event.type) {
      console.log("handle escfun");
      props.handleClose();
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    document.addEventListener("click", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
      document.removeEventListener("click", escFunction, false);
    };
  }, []);
  return "undefined" === typeof props.show || props.show ? (
    <Overlay handleClose={props.handleClose}>
      <div className="pxq_pgck_popup__header">{props.header}</div>
      <div className="pxq_pgck_popup__body">{props.children}</div>
      <div className="pxq_pgck_popup__footer">{props.footer}</div>
    </Overlay>
  ) : null;
}

export function BuyCreditsPopup(props) {
  return (
    <Popup
      handleClose={props.handleClose}
      header={
        <span>
          <h2>{props.heading}</h2>
        </span>
      }
      footer={
        <button
          onClick={() => {
            window.open(props.url);
          }}
        >
          Buy credits
        </button>
      }
    >
      {props.msg}
    </Popup>
  );
}
