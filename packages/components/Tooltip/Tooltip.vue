<script setup lang="ts">
import type { TooltipProps, TooltipEmits, TooltipInstance } from "./types";
import { createPopper, type Instance } from "@popperjs/core";
import {
  ref,
  reactive,
  watch,
  watchEffect,
  onUnmounted,
  computed,
  onMounted,
  // isVNode,
  type WatchStopHandle,
  // type VNode,
} from "vue";
import { bind, debounce, each, isElement, type DebouncedFunc } from "lodash-es";
import { useClickOutside } from "@eric-ui/hooks";

defineOptions({
  name: "ErTooltip",
});

interface _TooltipProps extends TooltipProps {
  virtualRef?: any;
  virtualTriggering?: boolean;
}

const props = withDefaults(defineProps<_TooltipProps>(), {
  placement: "bottom",
  trigger: "hover",
  transition: "fade",
  showTimeout: 150,
  hideTimeout: 150,
});
const emits = defineEmits<TooltipEmits>();
const isOpen = ref(false);

const containerNode = ref<HTMLElement>();
const popperNode = ref<HTMLElement>();
const triggerNode = ref<HTMLElement>();

let popperInstance: null | Instance;
let events: Record<string, any> = reactive({});
let outerEvents: Record<string, any> = reactive({});
let dropdownEvents: Record<string, any> = reactive({});

const popperOptions = computed(() => ({
  placement: props.placement,
  modifiers: [
    {
      name: "offset",
      options: {
        offset: [0, 9],
      },
    },
  ],
  ...props.popperOptions,
}));

const openDelay = computed(() =>
  props.trigger === "hover" ? props.showTimeout : 0
);

const closeDelay = computed(() =>
  props.trigger === "hover" ? props.hideTimeout : 0
);

let openDebounce: DebouncedFunc<() => void> | void;
let closeDebounce: DebouncedFunc<() => void> | void;

function openFinal() {
  closeDebounce?.cancel();
  openDebounce?.();
}

function closeFinal() {
  openDebounce?.cancel();
  closeDebounce?.();
}

function togglePopper() {
  isOpen.value ? closeFinal() : openFinal();
}

function setVisible(val: boolean) {
  if (props.disabled) return;
  isOpen.value = val;
  emits("visible-change", val);
}

function attachEvents() {
  if (props.disabled || props.manual) return;
  if (props.trigger === "hover") {
    events["mouseenter"] = openFinal;
    outerEvents["mouseleave"] = closeFinal;
    dropdownEvents["mouseenter"] = openFinal;
    return;
  }
  if (props.trigger === "click") {
    events["click"] = togglePopper;
  }
  if (props.trigger === "contextmenu") {
    events["contextmenu"] = (e: MouseEvent) => {
      e.preventDefault();
      openFinal();
    };
  }
}

function destroyPopperInstance() {
  popperInstance?.destroy();
  popperInstance = null;
}

function resetEvents() {
  events = {};
  outerEvents = {};
  dropdownEvents = {};

  attachEvents();
}

if (!props.manual) {
  attachEvents();
}

const show: TooltipInstance["show"] = openFinal;

const hide: TooltipInstance["hide"] = function () {
  openDebounce?.cancel();
  setVisible(false);
};

useClickOutside(containerNode, () => {
  emits("click-outside");
  if (props.trigger === "hover" || props.manual) return;
  isOpen.value && closeFinal();
});

watch(
  isOpen,
  (val) => {
    if (!val) return;

    if (triggerNode.value && popperNode.value) {
      popperInstance = createPopper(
        triggerNode.value,
        popperNode.value,
        popperOptions.value
      );
    }
  },
  { flush: "post" }
);

watch(
  () => props.manual,
  (isManual) => {
    if (isManual) {
      events = {};
      outerEvents = {};
      dropdownEvents = {};
      return;
    }
    attachEvents();
  }
);

watch(
  () => props.trigger,
  (newTrigger, oldTrigger) => {
    if (newTrigger === oldTrigger) return;
    resetEvents();
  }
);

watch(
  () => props.disabled,
  (val, oldVal) => {
    if (val === oldVal) return;
    openDebounce?.cancel();
    isOpen.value = false;
    emits("visible-change", false);
    resetEvents();
  }
);

watchEffect(() => {
  openDebounce = debounce(bind(setVisible, null, true), openDelay.value);
  closeDebounce = debounce(bind(setVisible, null, false), closeDelay.value);
});

let watchVirtualRefStopHandle: WatchStopHandle | void;
let watchEventsStopHandle: WatchStopHandle | void;

onMounted(() => {
  watchVirtualRefStopHandle = watch(
    () => props.virtualRef,
    (virtualRef) => {
      if (virtualRef && props.virtualTriggering) {
        triggerNode.value = virtualRef;
      }
    },
    {
      immediate: true,
    }
  );
  watchEventsStopHandle = watch(triggerNode, (triggerRef) => {
    const el = (triggerRef as any)?.$el;

    if (!props.virtualTriggering) return;
    console.log(popperOptions.value);
    if (isElement(el)) {
      each(events, (fn, event) => {
        el?.addEventListener(event, fn);
      });
    }
  });
});

onUnmounted(() => {
  popperInstance?.destroy();
  watchEventsStopHandle?.();
  watchVirtualRefStopHandle?.();
});

defineExpose<TooltipInstance>({
  show,
  hide,
});
</script>

<template>
  <div class="er-tooltip" ref="containerNode" v-on="outerEvents">
    <div
      class="er-tooltip__trigger"
      ref="triggerNode"
      v-on="events"
      v-if="!virtualTriggering"
    >
      <slot></slot>
    </div>
    <slot name="default" v-else></slot>

    <transition :name="transition" @after-leave="destroyPopperInstance">
      <div
        class="er-tooltip__popper"
        ref="popperNode"
        v-on="dropdownEvents"
        v-if="isOpen"
      >
        <slot name="content">
          {{ content }}
        </slot>
        <div id="arrow" data-popper-arrow></div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
@import "./style.css";
</style>
