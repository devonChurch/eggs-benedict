# Eggs Benedict 🥚🥓🍞🍽

## What 👋

A simple utility that limits the impact of functions the demand **high CPU** load.

## Why 🤷‍♀️

Functionality that demands intense CPU load can create a poor user experience as their session can hang and become unresponsive.

There are _**throttle**_ and _**debounce**_ solutions that help to alleviate the repercussions of CPU intensive UI. _Eggs Benedict_ incorporates these methodologies into a lightweight _**React**_ and _**Vanilla JS**_ abstraction.

---

_Eggs Benedict_ was originally designed to help with the various complex calculations associated with the [Avocado application](https://github.com/devonChurch/avocado). The library has since been enhanced into a simple developer API that can yield powerful results.

![Avocado demo](https://user-images.githubusercontent.com/15273233/70855526-15556d00-1f31-11ea-839c-3c4a284a59ca.gif)

## How 💡

This library uses [Request Animation Frame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) to implement _**throttle**_ and _**debounce**_ solutions simultaneously. This provides the real-time updates of a _throttler_ while ensuring that the UI does not fall out of sync with a _debouncer_.

![Eggs Benedict Flow](https://user-images.githubusercontent.com/15273233/78968151-05a10a80-7b58-11ea-997d-83581fe360ec.png)

## Options ⚙️

_Eggs Benedict_ offers some light configuration for custom _**throttle**_ and _**debounce**_ delays.

```
{
  throttleDelay: 0, // Default.
  debounceDelay: 100 // Default.
}
```

Take a look at the [interactive CodeSandbox](https://codesandbox.io/s/eager-torvalds-th3lz) to see configuration examples and their correlation with different CPU loads.

![eggs-benedict-options-example](https://user-images.githubusercontent.com/15273233/78968127-033eb080-7b58-11ea-9686-f6d9ed53b344.gif)

## Typescript 👌

You can reference the _Eggs Benedict_ types directly in your application.

```javascript
import { Options } from "eggs-benedict/types";
```

You can also supply a typed callback as a generic to the _**React Hooks**_ and _Vanilla JS_ initializers.

### React Hooks

```typescript
// prettier-ignore
const setLoadControlValue =
  useLoadControl<(value: string) => void>(callback);
```

### Vanilla JS

```typescript
// prettier-ignore
const [activeLoadControl, cleanUpLoadControl] =
  LoadControl<(value: string) => void>(callback);
```

## Examples 📝

### React Hooks

[In this example](https://codesandbox.io/s/determined-khayyam-ku303) we are using the _**React Hooks**_ import to run some CPU heavy work when the _Range_ `<input />` changes its value.

```javascript
import React from "react";
import { useLoadControl } from "eggs-benedict/hooks";

export default function App() {
  const [count, setCount] = React.useState(0);
  const heavyCpuLoad = (value) => {
    /**
     * CPU HEAVY WORK HERE!
     * - - - - - - - - - - -
     * Maybe some complex calculations based on the Range <input /> value 🤓
     */
    setCount(value);
  };
  const setLoadControlCount = useLoadControl(heavyCpuLoad);
  const handleChange = (event) =>
    setLoadControlCount(event.currentTarget.value);

  return (
    <>
      <input type="range" value={count} onChange={handleChange} />
      <p>{count}</p>
    </>
  );
}
```

### Vanilla JS

[In this example](https://codesandbox.io/s/hidden-fast-bsvpe) we are using a _**Vanilla JS**_ implementation inside a _**React**_ `useEffect` scaffold. When the user scrolls the `window` we run a CPU heavy callback.

```javascript
import React from "react";
import LoadControl from "eggs-benedict";

export default function App() {
  const [scroll, setScroll] = React.useState(0);
  React.useEffect(() => {
    const heavyCpuLoad = (event) => {
      /**
       * CPU HEAVY WORK HERE!
       * - - - - - - - - - - -
       * Maybe slow DOM heavy math to move some elements around 🤓
       */
      setScroll(event.currentTarget.scrollY);
    };
    const [scrollLoadControl, cleanUpScrollLoadControl] = LoadControl(
      heavyCpuLoad
    );
    window.addEventListener("scroll", scrollLoadControl);

    /**
     * Remember to remove the Eggs Benedict instance when unmounting your
     * <Component /> 👍
     */
    return cleanUpScrollLoadControl;
  }, []);
  return (
    <>
      <p style={{ position: "fixed" }}>{scroll}</p>
      <div
        style={{
          height: "200vh",
          backgroundImage: "linear-gradient(to bottom, #58FFC7, #2D8165)",
        }}
      />
    </>
  );
}
```
