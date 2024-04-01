import ErDropdown from "./Dropdown.vue";
import ErDropdownItem from "./DropdownItem.vue";
import type { App } from "vue";

ErDropdown.install = function (app: App) {
  app.component(ErDropdown.name, ErDropdown);
};
ErDropdownItem.install = function (app: App) {
  app.component(ErDropdownItem.name, ErDropdownItem);
};

export { ErDropdown, ErDropdownItem };
export * from "./types";
