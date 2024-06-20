import { each, isFunction } from "lodash-es";
import shell from "shelljs";
function hooksPlugin({
  rmFiles = [],
  afterBuild,
  beforeBuild
}) {
  return {
    name: "custom-hooks-plugin",
    buildStart() {
      each(rmFiles, (fName) => shell.rm("-rf", fName));
      isFunction(beforeBuild) && beforeBuild();
    },
    buildEnd(err) {
      !err && isFunction(afterBuild) && afterBuild();
    }
  };
}
export {
  hooksPlugin
};
