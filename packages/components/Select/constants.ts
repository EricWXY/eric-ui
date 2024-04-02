import type { InjectionKey } from "vue";
import type { SleectContext } from "./types";

export const SELECT_CTX_KEY: InjectionKey<SleectContext> =
  Symbol("selectContext");
