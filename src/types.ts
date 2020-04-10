export type Args = any;
export type Noop = () => void;
export type ActiveLoadControl = (...args: Args[]) => void;
export type CleanUpLoadControl = () => void;
export interface Options {
  throttleDelay?: number;
  debounceDelay?: number;
}
