import ErIcon from "./Icon.vue";
import type { App } from "vue";

ErIcon.install = function (app: App) {
  app.component(ErIcon.name, ErIcon);
};

export { ErIcon };

export * from "./types";
