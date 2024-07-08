import type {
  CreateNotificationProps,
  NotificationInstance,
  NotificationFn,
  Notification,
  NotificationParams,
  NotificationHandler,
  NotificationProps,
  notificationType,
} from "./types";
import { notificationTypes, notificationPosition } from "./types";
import { shallowReactive, isVNode, render, h } from "vue";
import { each, findIndex, isString, set, get } from "lodash-es";
import { useZIndex, useId } from "@eric-ui/hooks";
import NotificationConstructor from "./Notification.vue";

const { nextZIndex } = useZIndex();

export const notificationDefaults = {
  type: "info",
  position: "top-right",
  duration: 3000,
  offset: 20,
  transitionName: "fade",
  showClose: true,
} as const;

const instancesMap: Map<NotificationProps["position"], NotificationInstance[]> =
  new Map();
each(notificationPosition, (key) => instancesMap.set(key, shallowReactive([])));

const getInstancesByPosition = (
  position: NotificationProps["position"]
): NotificationInstance[] => instancesMap.get(position)!;

function normalizeOptions(
  options: NotificationParams
): CreateNotificationProps {
  const result =
    !options || isVNode(options) || isString(options)
      ? { message: options }
      : options;

  return { ...notificationDefaults, ...result } as CreateNotificationProps;
}

function createNotification(
  props: CreateNotificationProps
): NotificationInstance {
  const id = useId().value;
  const container = document.createElement("div");
  const instances = getInstancesByPosition(props.position || "top-right");
  const destory = () => {
    const idx = findIndex(instances, { id });

    if (idx === -1) return;

    instances.splice(idx, 1);

    render(null, container);
  };

  const _props = {
    ...props,
    id,
    zIndex: nextZIndex(),
    onDestory: destory,
  };

  const vnode = h(NotificationConstructor, _props);
  render(vnode, container);

  document.body.appendChild(container.firstElementChild!);

  const vm = vnode.component!;
  const handler: NotificationHandler = {
    close: () => vm.exposed?.close(),
  };
  const instance: NotificationInstance = {
    props: _props,
    id,
    vm,
    vnode,
    handler,
  };
  instances.push(instance);
  return instance;
}

export const notification: NotificationFn & Partial<Notification> = function (
  options = {}
) {
  const normalized = normalizeOptions(options);
  const instance = createNotification(normalized);
  return instance.handler;
};

export function closeAll(type?: notificationType) {
  instancesMap.forEach((instances) => {
    each(instances, (instance) => {
      if (type) {
        instance.props.type === type && instance.handler.close();
        return;
      }
      instance.handler.close();
    });
  });
}

export function getLastBottomOffset(this: NotificationProps) {
  const instances = getInstancesByPosition(this.position || "top-right");
  const idx = findIndex(instances, { id: this.id });

  if (idx <= 0) return 0;

  return get(instances, [idx - 1, "vm", "exposed", "bottomOffset", "value"]);
}

each(notificationTypes, (type) => {
  set(notification, type, (options: NotificationParams) => {
    const normalized = normalizeOptions(options);
    return notification({ ...normalized, type });
  });
});

notification.closeAll = closeAll;

export default notification as Notification;
