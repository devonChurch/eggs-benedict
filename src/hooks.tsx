import * as React from "react";
import LoadControl from "./index";
import { ActiveLoadControl, Options } from "./types";

export const useLoadControl = function <Callback extends Function>(
  callback: Callback,
  options?: Options
): ActiveLoadControl | Callback {
  const loadControl = React.useRef<ActiveLoadControl | undefined>();

  React.useEffect(() => {
    const [activeLoadControl, cleanUpLoadControl] = LoadControl<Callback>(
      callback,
      options
    );
    loadControl.current = activeLoadControl;
    return cleanUpLoadControl;
  }, []);

  // If the useEffect system has not been setup yet (happens in the first tick(s))
  // then we just fall back to the vanilla callback until the "load control"
  // enrichment is complete.
  return loadControl.current || callback;
};
