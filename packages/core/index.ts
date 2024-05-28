import { makeInstaller } from "@eric-ui/utils";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import componens from "./componens";
import "@eric-ui/theme/index.css";

library.add(fas);

const installer = makeInstaller(componens);

export * from "@eric-ui/components";
export default installer;

if (PROD) {
  console.info(
    '%c__________________________________\n'+
    "%c ______    %c  _      _  %c  _ _____ \n" +
      "%c|  ____|  %c  (_)    | |%c  | |_   _| \n" +
      "%c| |__   _ __ _ %c ___| |%c  | | | | \n" +
      "%c|  __| | '__%c| |/ __| |%c  | | | | \n" +
      "%c| |____| |  | | (__| |%c__| |_| |_ \n" +
      "%c|______|_|  |_|\\___/\\_%c___/|_____| \n" +
      "__________________________________\n" +
      "          author:EricWXY                    ",
    "color:#ff0000",
    "color:#ff0000",
    "color:#ff3b00",
    "color:#ff7500",
    "color:#ff7800",
    "color:#FD7B00",
    "color:#FFAD00",
    "color:#FEDA00",
    "color:#D0FD00",
    "color:#93FF00",
    "color:#80FF00",
    "color:#1AFF00",
    "color:#00FF2E",
    "color:#00FF3B",
    "color:#00FFB1",
    "color:#00F2F9",
    "color:#00E0F9"
  );
} else if (DEV) {
  console.log("[EricUI]:dev mode...");
}
