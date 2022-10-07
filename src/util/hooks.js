import { useState, useEffect } from "react";
import { doAjax } from "./ajax";

export function useAjax({
  ajax = null,
  repeatCount = 1,
  repeatDelay = 1000,
  autoStart = true
} = {}) {
  const [response, setResponse] = useState({ data: null, fail: null });
  const [counter, setCounter] = useState(0);
  const [start, setStart] = useState(autoStart);
  const [sleep, setSleep] = useState(0);
  const [ajaxArgs, setAjaxArgs] = useState(ajax);
  console.log("counter", counter, start, sleep, repeatCount);
  useEffect(() => {
    console.log("%cSleep try: ", "color:#fff;background:blue");
    if (2 === sleep && start && counter < repeatCount) {
      console.log("going to sleep", sleep);
      setSleep(3);
      let id = null;
      id = setTimeout(() => {
        console.log("waking up from sleep", sleep);
        setSleep(0);
        if (id) clearTimeout(id);
      }, repeatDelay);
      return;
    }
  }, [sleep]);

  useEffect(() => {
    console.log("in useeffect", start, counter, sleep, ajaxArgs);
    if (sleep > 0 || !ajaxArgs) {
      if (1 === sleep) {
        console.log("incrementing sleep", sleep);
        setSleep(2);
        return;
      }
      console.log("currently sleeping", sleep);
      return;
    }
    let xhr = null;
    //console.log("checking ajax", start, counter, sleep);
    if (start && counter < repeatCount) {
      //console.log("doing ajax", start, counter, sleep);
      xhr = doAjax(
        ajaxArgs,
        (data) => {
          //console.log("ajax success", start, counter, sleep);
          if (data.success) setResponse({ data: data.data, fail: null });
          else setResponse({ data: null, fail: data.data.message });
        },
        (errorMsg) => {
          console.log("ajax fail", errorMsg);
          setResponse({ data: null, fail: errorMsg });
        },
        () => {
          setCounter((counter) => counter + 1);
          setSleep(1);
          //console.log("finalyy", xhr);
          xhr = null;
        }
      );
    } //console.log("stopped", counter);
    return () => {
      console.log("cleanup", xhr);
      if (xhr) {
        console.log("useAjax:: aborting xhr");
        xhr.abort();
      }
    };
  }, [counter, start, sleep, ajaxArgs]);
  return [
    response,
    {
      start: (ajaxArgs) => {
        setCounter(0);
        setStart(true);
        setSleep(0);
        setResponse({ data: null, fail: null });
        console.log("going to retry");
        ajaxArgs && setAjaxArgs(ajaxArgs);
      },
      stop: () => {
        console.log("%cStopping Ajax: ", "color:#fff;background:black");
        console.log("stopping ajax", sleep);
        setStart(false);
      }
    },
    counter,
    sleep,
    start ? false : true
  ];
}
