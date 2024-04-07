import {
  type Directive,
  type UnwrapRef,
  type DirectiveBinding,
  ref,
  isRef,
} from "vue";
import type { LoadingOptions } from "./types";
import { type LoadingInstance, Loading } from "./service";
import { get, isObject, isString, keys, set } from "lodash-es";

const INSTANCE_KEY = Symbol("loading");

export type LoadingBinding = boolean | UnwrapRef<LoadingOptions>;
export interface ElementLoading extends HTMLElement {
  [INSTANCE_KEY]?: {
    instance: LoadingInstance;
    options: LoadingOptions;
  };
}

function createInstance(
  el: ElementLoading,
  binding: DirectiveBinding<LoadingBinding>
) {
  const vm = binding.instance;

  const getBindingProp = <K extends keyof LoadingOptions>(
    key: K
  ): LoadingOptions[K] =>
    isObject(binding.value) ? binding.value[key] : void 0;

  const resolvedExpression = (key: any) => {
    const data = (isString(key) && get(vm, key)) || key;
    if (data) return ref(data);
    return data;
  };

  const getProp = <K extends keyof LoadingOptions>(name: K) =>
    resolvedExpression(getBindingProp(name));

  const fullscreen =
    getBindingProp("fullscreen") ?? binding.modifiers.fullscreen;

  const options: LoadingOptions = {
    text: getProp("text"),
    spinner: getProp("spinner"),
    background: getProp("background"),
    visible: getProp("visible")?? true,
    target: getBindingProp("target") ?? (fullscreen ? undefined : el),
    body: getBindingProp("body") ?? binding.modifiers.body,
    lock: getBindingProp("lock") ?? binding.modifiers.lock,
    fullscreen,
  };
  el[INSTANCE_KEY] = {
    options,
    instance: Loading(options),
  };
}

function updatedOptions(
  newOptions: UnwrapRef<LoadingOptions>,
  originOptions: LoadingOptions
) {
  for (const key of keys(originOptions)) {
    if (isRef(get(originOptions, key))) {
      set(originOptions, [key, "value"], get(newOptions, key));
    }
  }
}

export const vLoading: Directive = {
  mounted(el, binding) {
    if (binding.value) createInstance(el, binding);
    // const { app, container } = createLoadingComponent();
    // const instance = app.mount(container);
    // el.instance = instance;
    // el.style.position = "relative";
    // if (binding?.value) {
    //   appendEl(el);
    // }
  },
  updated(el, binding) {
    const instance = el[INSTANCE_KEY];
    if (binding.oldValue === binding.value) return;

    if (binding.value && !binding.oldValue) {
      createInstance(el, binding);
      return;
    }
    if (binding.value && binding.oldValue) {
      isObject(binding.value) &&
        updatedOptions(binding.value, instance!.options);

      return;
    }

    instance?.instance?.close();
    // if (binding?.value !== binding.oldValue) {
    //   binding.value ? appendEl(el) : removeEl(el);
    // }
  },

  unmounted(el) {
    el[INSTANCE_KEY]?.instance.close();
    el[INSTANCE_KEY] = null;
  },
};
