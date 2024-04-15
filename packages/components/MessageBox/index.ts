import MessageBox from "./methods";
import { set } from "lodash-es";

import type { App } from "vue";

export const ErMessageBox = MessageBox;

set(ErMessageBox, "install", (app: App) => {
  app.config.globalProperties.$msgbox = MessageBox;
  app.config.globalProperties.$messageBox = MessageBox;
});

export default ErMessageBox;
export * from "./types";
