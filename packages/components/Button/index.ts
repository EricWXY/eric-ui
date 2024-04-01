import ErButton from "./Button.vue";
import type { App } from "vue";

ErButton.install = (app: App) => {
  app.component(ErButton.name, ErButton);
};

export { ErButton };

export * from './types'
