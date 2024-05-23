import { makeInstaller } from "@eric-ui/utils";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import componens from "./componens";
import "@eric-ui/theme/index.css";

library.add(fas);

const installer = makeInstaller(componens);

export * from "../components";
export default installer;
