import Form from "./Form.vue";
import FormItem from "./FormItem.vue";
import { withInstall } from "@eric-ui/utils";

export const ErForm = withInstall(Form);
export const ErFormItem = withInstall(FormItem);

export * from "./types";
export * from "./hooks";
