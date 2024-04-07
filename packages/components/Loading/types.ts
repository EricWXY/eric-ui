import type { MaybeRef } from "@eric-ui/utils";

export interface LoadingOptionsResolved {
  parent?: HTMLElement;
  target?: HTMLElement;
  visible?: boolean;
  background?: MaybeRef<string>;
  spinner?: MaybeRef<boolean | string>;
  text?: MaybeRef<string>;
  fullscreen?: boolean;
  lock?: boolean;
  closed?: () => void;
}

export type LoadingOptions = Partial<
  Omit<LoadingOptionsResolved, "parent" | "target"> & {
    target: HTMLElement | string;
    body: boolean;
    onAfterLeave: () => void;
  }
>;
