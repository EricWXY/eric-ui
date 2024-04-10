import type { MaybeRef } from "vue";

export interface LoadingOptionsResolved {
  parent?: HTMLElement;
  target?: HTMLElement;
  visible?: MaybeRef<boolean>;
  background?: MaybeRef<string>;
  spinner?: MaybeRef<boolean | string>;
  text?: MaybeRef<string>;
  fullscreen?: MaybeRef<boolean>;
  lock?: MaybeRef<boolean>;
  beforeClose?(): boolean;
  closed?(): void;
}

export type LoadingOptions = Partial<
  Omit<LoadingOptionsResolved, "parent" | "target"> & {
    target: HTMLElement | string;
    body: boolean;
    zIndex?: number;
    onAfterLeave(): void;
  }
>;
