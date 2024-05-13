import { type Directive, type DirectiveBinding, type MaybeRef } from "vue";
import type { LoadingOptions } from "./types";
import { type LoadingInstance, Loading } from "./service";

const INSTANCE_KEY = Symbol("loading");

export interface ElementLoading extends HTMLElement {
  [INSTANCE_KEY]?: {
    instance: LoadingInstance;
    options: LoadingOptions;
  };
}

function createInstance(
  el: ElementLoading,
  binding: DirectiveBinding<boolean>
) {
  const getProp = <K extends keyof LoadingOptions>(name: K) => {
    return el.getAttribute(`er-loading-${name}`) as MaybeRef<string>;
  };

  const getModifier = <K extends keyof LoadingOptions>(name: K) => {
    return binding.modifiers[name];
  };

  const fullscreen = getModifier("fullscreen");

  const options: LoadingOptions = {
    text: getProp("text"),
    spinner: getProp("spinner"),
    background: getProp("background"),
    target: fullscreen ? void 0 : el,
    body: getModifier("body"),
    lock: getModifier("lock"),
    fullscreen,
  };
  el[INSTANCE_KEY] = {
    options,
    instance: Loading(options),
  };
}

export const vLoading: Directive<ElementLoading, boolean> = {
  mounted(el, binding) {
    if (binding.value) createInstance(el, binding);
  },
  updated(el, binding) {
    if (binding.oldValue === binding.value) return;

    if (binding.value && !binding.oldValue) {
      createInstance(el, binding);
      return;
    }

    el[INSTANCE_KEY]?.instance?.close();
  },

  unmounted(el) {
    el[INSTANCE_KEY]?.instance.close();
    el[INSTANCE_KEY] = void 0;
  },
};
