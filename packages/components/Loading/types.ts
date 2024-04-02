import type { MaybeRef } from "@eric-ui/utils";

export interface LoadingOptionsResolve {
  parent: HTMLElement;

  background: MaybeRef<string>;
  svg: MaybeRef<string>;
  spinner: MaybeRef<boolean | string>;
  text: MaybeRef<string>;
  fullscreen: boolean;
  lock: boolean;
  visible: boolean;
  target: HTMLElement;
  baforeClose?: () => boolean;
  closed?: () => void;
}

export type LoadingOptions = Partial<
  Omit<LoadingOptionsResolve, "parent" | "target"> & {
    target: HTMLElement | string;
    body: boolean;
    onDestory: () => void;
  }
>;
