import { createApp } from "vue";
import App from "./App.vue";
import EricUI from "eric-ui";

import "eric-ui/dist/index.css";

const app = createApp(App);
app.use(EricUI);
app.mount("#app");
