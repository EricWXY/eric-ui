import ErTooltip from "./Tooltip.vue";
import type { App } from "vue";

ErTooltip.install = function (app: App) {
  app.component(ErTooltip.name, ErTooltip);
};

export { ErTooltip };
export * from "./types";
