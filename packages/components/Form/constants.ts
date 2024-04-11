import type { InjectionKey } from "vue";
import type { FormContext, FormItemContext } from "./types";

export const FORM_CTX_KEY: InjectionKey<FormContext> = Symbol("formContext");
export const FORM_ITEM_CTX_KEY: InjectionKey<FormItemContext> =
  Symbol("formItemContext");
