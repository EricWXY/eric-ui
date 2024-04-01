import Message from "./methods";
import { withInstallFunction } from "@eric-ui/utils";

export const ErMessage = withInstallFunction(Message, "$message");

export * from "./types";
