import { each } from "lodash-es";
import shell from "shelljs";

export default function customHooksPlugin({
  rmFiles = [],
  afterBuild,
}: {
  rmFiles?: string[];
  afterBuild: Function;
}) {
  return {
    name: "custom-hooks-plugin",
    buildStart() {
      each(rmFiles, (fName) => shell.rm("-rf", fName));
    },
    buildEnd(err?: Error) {
      !err && afterBuild();
    },
  };
}
