import type { LoadingOptions, LoadingOptionsResolved } from "./types";
import { createApp, reactive, nextTick, toRef } from "vue";
import LoadingComp from "./Loading.vue";
import { defer, delay, isNil, isString } from "lodash-es";

const RELATIVE_CLASS = "el-loading-parent--relative" as const;
function createLoadingComponent(options: LoadingOptionsResolved) {
  const handleAfterLeave = () => {
    destory();
  };

  const data = reactive({
    ...options,
    visible: true,
    onAfterLeave: handleAfterLeave,
  });

  const setText = (text: string) => (data.text = text);

  const destory = () => {
    vm.$el?.parentNode?.removeChild(vm.$el);
    app.unmount();
  };

  let afterLeaveTimer: number;
  const close = () => {
    clearTimeout(afterLeaveTimer);
    afterLeaveTimer = defer(handleAfterLeave);

    data.visible = false;
    options.closed?.();
  };

  const app = createApp(LoadingComp, { ...data });
  const vm = app.mount(document.createElement("div"));

  return {
    get $el(): HTMLElement {
      return vm.$el;
    },
    visible: toRef(data.visible),
    vm,
    close,
    setText,
  };
}

function resolveOptions(options: LoadingOptions): LoadingOptionsResolved {
  let target: HTMLElement;
  if (isString(options.target)) {
    target = document.querySelector(options.target) ?? document.body;
  } else {
    target = options.target || document.body;
  }
  return {
    parent: target === document.body || options.body ? document.body : target,
    background: options.background ?? "rgba(0, 0, 0, 0.5)",
    spinner: options.spinner || false,
    text: options.text || "",
    fullscreen: target === document.body && (options.fullscreen ?? true),
    lock: options.lock ?? false,
    visible: options.visible ?? true,
    target,
  };
}

function addRelativeClass(target: HTMLElement) {
  target.classList.add(RELATIVE_CLASS);
}

function removeRelativeClass(target: HTMLElement) {
  target.classList.remove(RELATIVE_CLASS);
}

let fullscreenInstance: LoadingInstance | null = null;

export type LoadingInstance = ReturnType<typeof createLoadingComponent>;

export function Loading(options: LoadingOptions = {}): LoadingInstance {
  const resolved = resolveOptions(options);

  if (resolved.fullscreen && !isNil(fullscreenInstance)) {
    return fullscreenInstance;
  }
  const instance = createLoadingComponent({
    ...resolved,
    closed: () => {
      resolved.closed?.();

      if (resolved.fullscreen) {
        fullscreenInstance = null;
      }
      delay(() => removeRelativeClass(resolved?.parent ?? document.body), 10);
    },
  });

  addRelativeClass(resolved?.parent ?? document.body);
  resolved.parent?.appendChild(instance.$el);

  nextTick(() => (instance.visible.value = !!resolved.visible));

  if (resolved.fullscreen) {
    fullscreenInstance = instance;
  }
  return instance;
}
