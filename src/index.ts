import {
  Args,
  Noop,
  CreateLoadControl,
  CleanUpLoadControl,
  Options,
} from "./types";

const THROTTLE_MILLISECONDS = 0;
const DEBOUNCE_MILLISECONDS = 100;

const getCurrentDate = Date.now;
const isDateStale = (date1 = 0, date2 = 0) => date1 < date2;

export const LoadControl = function <Callback extends Function>(
  callback: Callback,
  {
    throttleDelay = THROTTLE_MILLISECONDS,
    debounceDelay = DEBOUNCE_MILLISECONDS,
  }: Options
): [CreateLoadControl, CleanUpLoadControl] {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // - - Throttler - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  let throttleId: number;
  let throttleDate: number;
  const createThrottle = (action: Noop) => {
    throttleDate = getCurrentDate();
    throttleId = window.requestAnimationFrame(action);
  };
  const removeThrottle = () => {
    window.cancelAnimationFrame(throttleId);
    throttleId = undefined;
  };
  const checkIsThrottling = () => Boolean(throttleId);

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // - - Debouncer - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  let debounceId: number;
  let debounceDate: number;
  const createDebounce = (...args: Args[]) => {
    debounceDate = getCurrentDate();
    debounceId = window.setTimeout(() => {
      // We do not want to run a debounced callback if it's stale (by being older
      // than the last run throttle callback). Here we check against the two "date"
      // references for the debounce and throttle callbacks and ONLY run the debounce
      // sequence if its NOT stale.
      if (!isDateStale(debounceDate, throttleDate)) {
        callback(...args);
      }
    }, debounceDelay + throttleDelay);
  };
  const removeDebounce = () => {
    window.clearTimeout(debounceId);
    debounceId = undefined;
  };

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // - - Load Control  - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Depending on the current "load controlled" situation we want to begin a
  // throttle sequence or defer the callback to a debounced scenario.
  const createLoadControl = () => (...args: Args[]) => {
    if (checkIsThrottling()) {
      // If we are already throttling - the callback is STILL IMPORTANT. If the
      // throttle finishes but misses the final user input then we could potential
      // have the <input /> and <Swatch /> UI out of sync. In this case we create
      // a debounced, which will wait a period of time then run the supplied callback.
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // We do not want to stack callbacks and have them ALL run once their timeout
      // expires. We ONLY care about the last supplied callback. In that regard,
      // we destroy the preceding debounced setup and create a new one. This keep
      // pushing out the time to run the callback while the thriller is still
      // running.
      removeDebounce();
      createDebounce(...args);
    } else {
      // If there is NO throttler instance then this is a "fresh" call to "load
      // control". Here we run the callback inside of a requestAnimationCall so
      // that its run when the browser has the capability to do so.
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // We ONLY want to run ONE callback per CPU cycle. In that regard we STOP
      // callbacks from stacking by creating and removing the RAF reference so
      // that ONLY one is running at a time BEFORE and AFTER the callback runs.
      createThrottle(() => {
        const throttleCallBack = () => {
          callback(...args);
          removeThrottle();
        };
        // If a setTimeout has a value of `0` it will move the callback to run on
        // the "next tick". This is not what we want in this scenario as we want
        // the RAF to trigger ASAP!
        if (throttleDelay) {
          setTimeout(throttleCallBack, throttleDelay);
        } else {
          throttleCallBack();
        }
      });
    }
  };

  const cleanUpLoadControl = () => {
    removeThrottle();
    removeDebounce();
  };

  return [createLoadControl, cleanUpLoadControl];
};
