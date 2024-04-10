import { isFunction } from "lodash-es";
import {
  getCurrentInstance,
  shallowRef,
  ref,
  watch,
  type ShallowRef,
} from "vue";
import useEventListener from "./useEventListener";

interface UseFocusControllerOptions {
  afterFocus?: () => void;
  beforeBlur?: (event: FocusEvent) => boolean | void;
  afterBlur?: () => void;
}

export function useFocusController<T extends HTMLElement>(
  target: ShallowRef<T | any | void>,
  { afterFocus, beforeBlur, afterBlur }: UseFocusControllerOptions = {}
) {
  const instance = getCurrentInstance()!;
  const { emit } = instance;
  const wrapperRef = shallowRef<HTMLElement>();
  const isFocused = ref(false);

  const handleFocus = (event: FocusEvent) => {
    if (isFocused.value) return;
    isFocused.value = true;
    emit("focus", event);
    afterFocus?.();
  };

  const handleBlur = (event: FocusEvent) => {
    const cancelBlur = isFunction(beforeBlur) ? beforeBlur(event) : false;
    if (
      cancelBlur ||
      (event.relatedTarget &&
        wrapperRef.value?.contains(event.relatedTarget as Node))
    )
      return;

    isFocused.value = false;
    emit("blur", event);
    afterBlur?.();
  };

  const handleClick = () => {
    target.value?.focus();
  };

  watch(wrapperRef, (el) => {
    if (el) {
      el.setAttribute("tabindex", "-1");
    }
  });

  useEventListener(wrapperRef, "click", handleClick);

  return {
    wrapperRef,
    isFocused,
    handleFocus,
    handleBlur,
  };
}

export default useFocusController;
