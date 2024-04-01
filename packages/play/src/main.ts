import { createApp } from "vue";
import App from "./App.vue";
import EricUi from "eric-ui";

const app = createApp(App);
app.use(EricUi);
app.mount("#app");
