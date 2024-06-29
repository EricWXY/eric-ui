import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import  makeInstaller  from "./makeInstaller";
import componens from "./componens";
import printLogo from "./pringLogo";

import "@eric-ui/theme/index.css";

printLogo();

library.add(fas);
const installer = makeInstaller(componens);

export * from '@eric-ui/locale'
export * from "@eric-ui/components";
export default installer;
