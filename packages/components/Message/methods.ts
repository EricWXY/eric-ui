import type { CreateMessageProps, MessageContext } from "./types";
import { render, h, shallowReactive } from "vue";
import { findIndex, get, each } from "lodash-es";
import MessageConstructor from "./Message.vue";
import { useZIndex } from "@eric-ui/hooks";

let seed = 0;

const instances: MessageContext[] = shallowReactive([]);
const { nextZIndex } = useZIndex();

export function createMessage(props: CreateMessageProps) {
  const id = `message_${seed++}`;
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
  const instance: MessageContext = {
    props: _props,
    id,
    vm,
    vnode,
  };
  instances.push(instance);
  return {
    ...instance,
    close: () => vm.exposed?.close(),
  };
}

export function getLastBottomOffset(id: string) {
  const idx = findIndex(instances, { id });
  if (idx <= 0) return 0;

  return get(instances, [idx - 1, "vm", "exposed", "bottomOffset", "value"]);
}

export function closeAll() {
  each(instances, (instance) => get(instance, ["vm", "exposed", "close"])());
}
