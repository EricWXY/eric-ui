import { inject } from "vue";
import Form from "./Form.vue";
import FormItem from "./FormItem.vue";
import { FORM_CTX_KEY, FORM_ITEM_CTX_KEY } from "./constants";
import { withInstall } from "@eric-ui/utils";

export const ErForm = withInstall(Form);
export const ErFormItem = withInstall(FormItem);

export function useFormItem() {
  const form = inject(FORM_CTX_KEY, void 0);
  const formItem = inject(FORM_ITEM_CTX_KEY, void 0);
  return { form, formItem };
}

export * from "./types";
