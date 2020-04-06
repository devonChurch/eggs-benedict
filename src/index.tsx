import * as React from "react";

type Args = any;
type Noop = () => void;
type ActiveLoadControl = (...args: Args[]) => void;
type CreateLoadControl = () => ActiveLoadControl;
type CleanUpLoadControl = () => void;

export const LoadControl = function <Callback extends Function>(
  callback: Callback
): [CreateLoadControl, CleanUpLoadControl] {
  // Throttler - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  //
  let throttleId: number;
  const createThrottle = (action: Noop) => {
    throttleId = window.requestAnimationFrame(action);
  };
  const removeThrottle = () => {
    window.cancelAnimationFrame(throttleId);
    throttleId = undefined;
  };
  const checkIsThrottling = () => Boolean(throttleId);

  // Debouncer - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  //
  const DEBOUNCE_MILLISECONDS = 100;
  let debounceId: number;
  const createDebounce = (...args: Args[]) =>
    (debounceId = window.setTimeout(
      () => callback(...args),
      DEBOUNCE_MILLISECONDS
    ));
  const removeDebounce = () => window.clearTimeout(debounceId);

  // Depending on the current "load controlled" situation we want to begin a
  // throttle sequence or defer the callback to a debounced scenario.
  const createLoadControl = () => (...args: Args[]) => {
    if (checkIsThrottling()) {
      // If we are already throttling - the callback is STILL IMPORTANT. If the
      // throttle finishes but misses the final user input then we could potential
      // have the <input /> and <Swatch /> UI out of sync. In this case we create
      // a debounced, which will wait a period of time then run the supplied callback.
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // We ONLY want to run ONE callback per CPU cycle. In that regard we STOP
      // callbacks from stacking by creating and removing the RAF reference so
      // that ONLY one is running at a time BEFORE and AFTER the callback runs.
      createThrottle(() => {
        callback(...args);
        removeThrottle();
      });
    }
  };

  const cleanUpLoadControl = () => {
    removeThrottle();
    removeDebounce();
  };

  return [createLoadControl, cleanUpLoadControl];
};

export const useLoadControl = function <Callback extends Function>(
  callback: Callback
): ActiveLoadControl | Callback {
  const loadControl = React.useRef<ActiveLoadControl | undefined>();

  React.useEffect(() => {
    const [createLoadControl, cleanUpLoadControl] = LoadControl<Callback>(
      callback
    );
    loadControl.current = createLoadControl();
    return cleanUpLoadControl;
  }, []);

  // If the useEffect system has not been setup yet (happens in the first tick(s))
  // then we just fall back to the vanilla callback until the "load control"
  // enrichment is complete.
  return loadControl.current || callback;
};
