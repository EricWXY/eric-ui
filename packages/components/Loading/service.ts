import type { LoadingOptions, LoadingOptionsResolved } from "./types";
import { ref, createApp, reactive, nextTick } from "vue";
import { useZIndex } from "@eric-ui/hooks";
import LoadingComp from "./Loading.vue";
import { delay, isNil, isString } from "lodash-es";

const RELATIVE_CLASS = "er-loading-parent--relative" as const;
const HIDDEN_CLASS = "er-loading-parent--hiden" as const;
const LOADING_NUMB_KEY = "er-loading-numb" as const;

const instanceMap: Map<HTMLElement, LoadingInstance> = new Map();
const { nextZIndex } = useZIndex(30000);

function createLoadingComponent(options: LoadingOptionsResolved) {
  const visible = ref(false);
  const afterLeaveFlag = ref(false);
  const handleAfterLeave = () => {
    if (!afterLeaveFlag.value) return;
    destroy();
  };

  const data = reactive({
    ...options,
    onAfterLeave: handleAfterLeave,
  });

  const setText = (text: string) => (data.text = text);

  const destroy = () => {
    const target = data.parent;
    subtLoadingNumb(target);
    if (getLoadingNumb(target)) return;
    delay(() => {
      removeRelativeClass(target);
      removeHiddenClass(target);
    }, 1);
    instanceMap.delete(target ?? document.body);
    vm.$el?.parentNode?.removeChild(vm.$el);
    app.unmount();
  };

  let afterLeaveTimer: number;
  const close = () => {
    if (options.beforeClose && !options.beforeClose()) return;

    afterLeaveFlag.value = true;
    clearTimeout(afterLeaveTimer);
    afterLeaveTimer = delay(handleAfterLeave, 500);

    visible.value = false;
    options.closed?.();
  };

  const app = createApp(LoadingComp, {
    ...data,
    zIndex: data.fullscreen ? nextZIndex() : void 0,
    visible,
  });
  const vm = app.mount(document.createElement("div"));

  return {
    get $el(): HTMLElement {
      return vm.$el;
    },
    vm,
    close,
    visible,
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
    spinner: options.spinner,
    text: options.text,
    fullscreen: target === document.body && (options.fullscreen ?? true),
    lock: options.lock ?? false,
    visible: options.visible ?? true,
    target,
  };
}

function addRelativeClass(target: HTMLElement = document.body) {
  target.classList.add(RELATIVE_CLASS);
}

function removeRelativeClass(target: HTMLElement = document.body) {
  target.classList.remove(RELATIVE_CLASS);
}

function addHiddenClass(target: HTMLElement = document.body) {
  target.classList.add(HIDDEN_CLASS);
}

function removeHiddenClass(target: HTMLElement = document.body) {
  target.classList.remove(HIDDEN_CLASS);
}

function getLoadingNumb(target: HTMLElement = document.body) {
  return target.getAttribute(LOADING_NUMB_KEY);
}

function removeLoadingNumb(target: HTMLElement = document.body) {
  target.removeAttribute(LOADING_NUMB_KEY);
}

function addLoadingNumb(target: HTMLElement = document.body) {
  const numb = getLoadingNumb(target) ?? "0";
  target.setAttribute(LOADING_NUMB_KEY, `${Number.parseInt(numb) + 1}`);
}

function subtLoadingNumb(target: HTMLElement = document.body) {
  const numb = getLoadingNumb(target);
  if (numb) {
    const newNumb = Number.parseInt(numb) - 1;
    if (newNumb === 0) {
      removeLoadingNumb(target);
    } else {
      target.setAttribute(LOADING_NUMB_KEY, `${newNumb}`);
    }
  }
}

function addClass(
  options: LoadingOptions,
  parent: HTMLElement = document.body
) {
  if (options.lock) {
    addHiddenClass(parent);
  } else {
    removeHiddenClass(parent);
  }

  addRelativeClass(parent);
}

let fullscreenInstance: LoadingInstance | null = null;

export type LoadingInstance = ReturnType<typeof createLoadingComponent>;

export function Loading(options: LoadingOptions = {}): LoadingInstance {
  const resolved = resolveOptions(options);
  const target = resolved.parent ?? document.body;

  if (resolved.fullscreen && !isNil(fullscreenInstance)) {
    return fullscreenInstance;
  }

  addLoadingNumb(resolved?.parent);
  if (instanceMap.has(target)) {
    return instanceMap.get(target)!;
  }

  const instance = createLoadingComponent({
    ...resolved,
    closed: () => {
      resolved.closed?.();

      if (resolved.fullscreen) {
        fullscreenInstance = null;
      }
    },
  });

  addClass(options, resolved?.parent);

  resolved.parent?.appendChild(instance.$el);

  nextTick(() => (instance.visible.value = !!resolved.visible));

  if (resolved.fullscreen) {
    fullscreenInstance = instance;
  }
  instanceMap.set(target, instance);
  return instance;
}
