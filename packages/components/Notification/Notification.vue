<script setup lang="ts">
import type { NotificationProps } from "./types";
import { ref, computed, onMounted } from "vue";
import { getLastBottomOffset } from "./methods";
import { bind, delay, isString } from "lodash-es";
import { RenderVnode, typeIconMap } from "@eric-ui/utils";
import { useOffset } from "@eric-ui/hooks";

import ErIcon from "../Icon/Icon.vue";

const props = withDefaults(defineProps<NotificationProps>(), {
  type: "info",
  duration: 3000,
  offset: 20,
  transitionName: "fade",
  showClose: true,
});
const visible = ref(false);
const notifyRef = ref<HTMLDivElement>();

// 这个 div 的高度
const boxHeight = ref(0);

const { topOffset, bottomOffset } = useOffset({
  getLastBottomOffset: bind(getLastBottomOffset, props),
  offset: props.offset,
  boxHeight,
});

const iconName = computed(() => {
  if (isString(props.icon)) return props.icon;
  return typeIconMap.get(props.type);
});

const horizontalClass = computed(() =>
  props.position.endsWith("right") ? "right" : "left"
);

const verticalProperty = computed(() =>
  props.position.startsWith("top") ? "top" : "bottom"
);

const cssStyle = computed(() => ({
  [verticalProperty.value]: topOffset.value + "px",
  zIndex: props.zIndex,
}));

let timer: number;

function startTimer() {
  if (props.duration === 0) return;
  timer = delay(close, props.duration);
}

function clearTimer() {
  clearTimeout(timer);
}

function close() {
  visible.value = false;
  props?.onClose?.();
}

onMounted(() => {
  visible.value = true;
  startTimer();
});

defineExpose({
  close,
  bottomOffset,
});
</script>

<template>
  <transition
    :name="`er-notification-${transitionName}`"
    @after-leave="!visible && onDestory()"
    @enter="boxHeight = notifyRef!.getBoundingClientRect().height"
  >
    <div
      ref="notifyRef"
      class="er-notification"
      :class="{
        [`er-notification--${type}`]: type,
        'show-close': showClose,
        [horizontalClass]: true,
      }"
      :style="cssStyle"
      v-show="visible"
      role="alert"
      @click="onClick"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
    >
      <er-icon v-if="iconName" :icon="iconName" class="er-notification__icon" />

      <div class="er-notification__text">
        <div class="er-notification__title">{{ title }}</div>
        <div class="er-notification__content">
          <slot>
            <render-vnode v-if="message" :vNode="message" />
          </slot>
        </div>
      </div>
      <div class="er-notification__close" v-if="showClose">
        <er-icon icon="xmark" @click.stop="close" />
      </div>
    </div>
  </transition>
</template>

<style scoped>
@import "./style.css";
</style>
