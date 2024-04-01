import ErCollapse from "./Collapse.vue";
import ErCollapseItem from "./CollapseItem.vue";
import type { App } from "vue";

ErCollapse.install = function (app: App) {
  app.component(ErCollapse.name, ErCollapse);
};

ErCollapseItem.install = function (app: App) {
  app.component(ErCollapseItem.name, ErCollapseItem);
};

export { ErCollapse, ErCollapseItem };

export * from "./types";
