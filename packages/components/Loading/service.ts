import type { LoadingOptions, LoadingOptionsResolved } from "./types";
import { createApp, reactive, toRefs, nextTick } from "vue";
import LoadingComp from "./Loading.vue";
import { defer, isNil, isString } from "lodash-es";
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
    // const target = data.parent;

    removeElLoadingChild();
    loadingInstance.unmount();
  };

  const removeElLoadingChild = () => {
    vm.$el?.parentNode?.removeChild(vm.$el);
  };

  let afterLeaveTimer: number;
  const close = () => {
    clearTimeout(afterLeaveTimer);

    data.visible = false;
    afterLeaveTimer = defer(handleAfterLeave);
    options.closed?.();
  };

  const loadingInstance = createApp(LoadingComp, { ...data });
  const vm = loadingInstance.mount(document.createElement("div"));

  return {
    ...toRefs(data),
    close,
    setText,
    handleAfterLeave,
    removeElLoadingChild,
    vm,
    get $el(): HTMLElement {
      return vm.$el;
    },
  };
}

export type LoadingInstance = ReturnType<typeof createLoadingComponent>;

let fullscreenInstance: LoadingInstance | null = null;
export function Loading(options: LoadingOptions = {}): LoadingInstance {
  const resolved = resolveOptions(options);

  if (resolved.fullscreen && !isNil(fullscreenInstance)) {
    return fullscreenInstance;
  }
  const instance = createLoadingComponent({
    ...resolved,
    closed: () => {
      resolved.closed?.();

      resolved.parent?.classList.remove("el-loading-parent--relative");
      if (resolved.fullscreen) {
        fullscreenInstance = null;
      }
    },
  });

  resolved.parent?.classList.add("el-loading-parent--relative");
  resolved.parent?.appendChild(instance.$el);

  nextTick(() => (instance.visible.value = !!resolved.visible));

  if (resolved.fullscreen) {
    fullscreenInstance = instance;
  }
  return instance;
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
