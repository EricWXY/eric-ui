import { each, isFunction } from "lodash-es";
import shell from "shelljs";

export default function hooksPlugin({
  rmFiles = [],
  afterBuild,
  beforeBuild,
}: {
  beforeBuild?: Function;
  afterBuild?: Function;
  rmFiles?: string[];
}) {
  return {
    name: "custom-hooks-plugin",
    buildStart() {
      each(rmFiles, (fName) => shell.rm("-rf", fName));
      isFunction(beforeBuild) && beforeBuild();
    },
    buildEnd(err?: Error) {
      !err && isFunction(afterBuild) && afterBuild();
    },
  };
}
