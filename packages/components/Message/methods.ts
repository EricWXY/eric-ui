import type {
  CreateMessageProps,
  MessageInstance,
  MessageFn,
  Message,
  MessageParams,
  MessageHandler,
  MessageProps,
  messageType,
} from "./types";
import { messageTypes } from "./types";
import { render, h, shallowReactive, isVNode } from "vue";
import { findIndex, get, each, set, isString } from "lodash-es";
import { useZIndex, useId } from "@eric-ui/hooks";
import MessageConstructor from "./Message.vue";

const instances: MessageInstance[] = shallowReactive([]);
const { nextZIndex } = useZIndex();

export const messageDefaults = {
  type: "info",
  duration: 3000,
  offset: 10,
  transitionName: "fade-up",
} as const;

function normalizeOptions(options: MessageParams): CreateMessageProps {
  const result =
    !options || isVNode(options) || isString(options)
      ? {
          message: options,
        }
      : options;

  return { ...messageDefaults, ...result } as CreateMessageProps;
}

function createMessage(props: CreateMessageProps): MessageInstance {
  const id = useId().value;
  const container = document.createElement("div");
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

  const vnode = h(MessageConstructor, _props);

  render(vnode, container);

  document.body.appendChild(container.firstElementChild!);

  const vm = vnode.component!;
  const handler: MessageHandler = {
    close: () => vm.exposed!.close(),
  };
  const instance: MessageInstance = {
    props: _props,
    id,
    vm,
    vnode,
    handler,
  };
  instances.push(instance);

  return instance;
}

export const message: MessageFn & Partial<Message> = function (options = {}) {
  const normalized = normalizeOptions(options);
  const instance = createMessage(normalized);

  return instance.handler;
};

export function getLastBottomOffset(this: MessageProps) {
  const idx = findIndex(instances, { id: this.id });
  if (idx <= 0) return 0;

  return get(instances, [idx - 1, "vm", "exposed", "bottomOffset", "value"]);
}

export function closeAll(type?: messageType) {
  each(instances, (instance) => {
    if (type) {
      instance.props.type === type && instance.handler.close();
      return;
    }
    instance.handler.close();
  });
}

each(messageTypes, (type) =>
  set(message, type, (options: MessageParams) => {
    const normalized = normalizeOptions(options);
    return message({ ...normalized, type });
  })
);

message.closeAll = closeAll;

export default message as Message;
