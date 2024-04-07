import Notification from "./methods";
import { withInstallFunction } from "@eric-ui/utils";

export const ErNotification = withInstallFunction(
  Notification,
  "$notification"
);

export * from "./types";
