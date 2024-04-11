<script setup lang="ts">
import type { TooltipProps, TooltipEmits, TooltipInstance } from "./types";
import { createPopper, type Instance } from "@popperjs/core";
import { ref, reactive, watch, onUnmounted, computed } from "vue";
import { bind, debounce } from "lodash-es";
import { useClickOutside } from "@eric-ui/hooks";

defineOptions({
  name: "ErTooltip",
});

const props = withDefaults(defineProps<TooltipProps>(), {
  placement: "bottom",
  trigger: "hover",
  transition: "fade",
  openDelay: 0,
  closeDelay: 0,
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

const closeDelay = computed(() =>
  props.trigger === "hover" && props.closeDelay < 150 ? 150 : props.closeDelay
);

const openDebounce = debounce(bind(setVisible, null, true), props.openDelay);
const closeDebounce = debounce(bind(setVisible, null, false), closeDelay.value);

function openFinal() {
  closeDebounce.cancel();
  openDebounce();
}

function closeFinal() {
  openDebounce.cancel();
  closeDebounce();
}

function togglePopper() {
  isOpen.value ? closeFinal() : openFinal();
}

function setVisible(val: boolean) {
  isOpen.value = val;
  emits("visible-change", val);
}

function attachEvents() {
  if (props.disabled) return;
  if (props.trigger === "hover") {
    events["mouseenter"] = openFinal;
    outerEvents["mouseleave"] = closeFinal;
    dropdownEvents["mouseenter"] = openFinal;
    return;
  }
  if (props.trigger === "click") {
    events["click"] = togglePopper;
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

useClickOutside(containerNode, () => {
  emits("click-outside");
  if (props.trigger !== "click" || props.manual) return;
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
    resetEvents();
  }
);

onUnmounted(() => {
  popperInstance?.destroy();
});

defineExpose<TooltipInstance>({
  show: openFinal,
  hide: () => {
    openDebounce.cancel();
    setVisible(false);
  },
});
</script>

<template>
  <div class="er-tooltip" ref="containerNode" v-on="outerEvents">
    <div class="er-tooltip__trigger" ref="triggerNode" v-on="events">
      <slot></slot>
    </div>
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
