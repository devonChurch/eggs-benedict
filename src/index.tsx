import * as React from "react";

console.log("Eggs Benidict | 0.0.1");

export const foo = () => console.log("(foo)");
export const bar: React.FunctionComponent<{}> = () => {
  React.useEffect(() => {
    console.log("(bar)");
  }, []);

  return <p>Bar!</p>;
};
