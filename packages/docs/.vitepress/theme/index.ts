import DefaultTheme from "vitepress/theme";
import { type App } from "vue";
import EricUI from "eric-ui";
import { ElementPlusContainer } from "@vitepress-demo-preview/component";

import "@vitepress-demo-preview/component/dist/style.css";

export default {
  ...DefaultTheme,
  enhanceApp({ app }: { app: App }) {
    app.component("demo-preview", ElementPlusContainer);
    app.use(EricUI);
  },
};
