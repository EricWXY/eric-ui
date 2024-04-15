import { type Ref, type VNode } from "vue";
import { type messageType } from "../Message/types";
import { type ButtonType } from "../Button/types";

export type MessageBoxAction = "confirm" | "cancel" | "close";
export type MessageBoxType = "" | "prompt" | "alert" | "confirm";
export type MessageBoxCallback = (
  action: MessageBoxAction | { value: string; action: MessageBoxAction }
) => void;

export type MessageBoxInputData = {
  value: string;
  action: MessageBoxAction;
};
export type MessageBoxData = MessageBoxInputData & MessageBoxAction;

export interface MessageBoxOptions {
  title?: string;
  message?: string | VNode | (() => VNode);
  type?: messageType;
  boxType?: MessageBoxType;
  icon?: string;
  callback?: MessageBoxCallback;
  showClose?: boolean;
  showInput?: boolean;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  cancelButtonText?: string;
  confirmButtonText?: string;
  cancelButtonLoading?: boolean;
  confirmButtonLoading?: boolean;
  cancelButtonDisabled?: boolean;
  confirmButtonDisabled?: boolean;

  cancelButtonType?: ButtonType;
  confirmButtonType?: ButtonType;
  roundButton?: boolean;

  center?: boolean;
  lockScroll?: boolean;
  closeOnClickModal?: boolean;

  inputPlaceholder?: string;
  inputValue?: string;
  inputType?: "text" | "textarea" | "password" | "number";

  buttonSize?: "default" | "small" | "large";
  beforeClose?: (
    action: MessageBoxAction,
    instance: MessageBoxOptions,
    done: () => void
  ) => void;
}

export interface MessageBoxProps extends MessageBoxOptions {
  visible?: Ref<boolean>;
  doClose(): void;
  doAction(action: MessageBoxAction, inputVal?: string): void;
  destroy(): void;
}

export type MessageBoxShortcutMethod = ((
  message: MessageBoxOptions["message"],
  title: MessageBoxOptions["title"],
  options?: MessageBoxOptions
) => Promise<MessageBoxData>) &
  ((
    message: MessageBoxOptions["message"],
    options?: MessageBoxOptions
  ) => Promise<MessageBoxData>);

export interface IErMessageBox {
  (options: MessageBoxOptions | string | VNode): Promise<any>;

  alert: MessageBoxShortcutMethod;
  confirm: MessageBoxShortcutMethod;
  prompt: MessageBoxShortcutMethod;
  close(): void;
}
