import { makeInstaller } from "@eric-ui/utils";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import {
  ErButton,
  ErCollapse,
  ErCollapseItem,
  ErIcon,
  ErDropdown,
  ErTooltip,
} from "@eric-ui/components";

import "@eric-ui/theme/index.css";


library.add(fas);

const components = [
  ErButton,
  ErCollapse,
  ErCollapseItem,
  ErIcon,
  ErDropdown,
  ErTooltip,
] as any[];

export * from "@eric-ui/components";
export default makeInstaller(components);
