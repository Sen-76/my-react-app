/// <reference types="vite/client" />

declare type A = any;
declare type Guid = string;
declare type DateTime = string;
declare type ClickEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;
type Base64Stream = ReadableStream<Buffer>;
declare interface ICRMFormComponentRef {
  submit: VoidFunction;
  setValue: (value: A) => Promise<void>;
  resetAreYouSure: VoidFunction;
}
declare interface ICRMFormComponentProps {
  onFinish: (value: A) => A;
}

declare interface SelectOption<T = string> {
  label?: string;
  value?: T;
}
