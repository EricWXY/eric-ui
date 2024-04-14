import { isNumber, isString } from "lodash-es";
import { debugWarn } from "./error";

const SCOPE = "utils/style" as const;

const isStringNumber = (val: string): boolean => {
  if (!isString(val)) {
    return false;
  }
  return !Number.isNaN(Number(val));
};
export function addUnit(value?: string | number, defaultUnit = "px") {
  if (!value) return "";
  if (isNumber(value) || isStringNumber(value)) {
    return `${value}${defaultUnit}`;
  }
  if (isString(value)) {
    return value;
  }
  debugWarn(SCOPE, "binding value must be a string or number");
}
