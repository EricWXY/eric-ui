import Notification from "./methods";
import { withInstallFunction } from "@eric-ui/utils";

export const ErNotification = withInstallFunction(
  Notification,
  "$notify"
);

export * from "./types";
