import { vLoading } from "./directive";
import { Loading } from "./service";

import type { App } from "vue";

export const ErLoading = {
  name:'ErLoading',
  install(app: App) {
    app.directive("loading", vLoading);
    app.config.globalProperties.$loading = Loading;
  },
  directive: vLoading,
  service: Loading,
};

export default ErLoading;

export {
  vLoading,
  vLoading as ErLoadingDirective,
  Loading as ErLoadingService,
};

export * from "./types";
