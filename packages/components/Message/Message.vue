<script setup lang="ts">
import type { MessageProps } from "./types";
import { computed, onMounted, ref, watch } from "vue";
import { getLastBottomOffset } from "./methods";
import { delay } from "lodash-es";
import { useEventListener } from "@eric-ui/hooks";
import { RenderVnode, typeIconMap } from "@eric-ui/utils";
import ErIcon from "../Icon/Icon.vue";

defineOptions({
  name: "ErMessage",
});

const props = withDefaults(defineProps<MessageProps>(), {
  type: "info",
  duration: 3000,
  offset: 10,
  transitionName: "fade-up",
});

const visible = ref(false);
const messageRef = ref<HTMLDivElement>();

// div 的高度
const boxHeight = ref(0);

const iconName = computed(() => typeIconMap.get(props.type) ?? "circle-info");

// 上一个实例最下面的坐标，第一个是0
const lastBottomOffset = computed(() => getLastBottomOffset(props.id));
// 本元素应该的 top
const topOffset = computed(() => props.offset + lastBottomOffset.value);
// 为下一个实例预留的底部 offset
const bottomOffset = computed(() => boxHeight.value + topOffset.value);

const cssStyle = computed(() => ({
  top: topOffset.value + "px",
  zIndex: props.zIndex,
}));

let timer: number;
function startTimmer() {
  if (props.duration === 0) return;
  timer = delay(close, props.duration);
}

function clearTimer() {
  clearTimeout(timer);
}

function close() {
  visible.value = false;
}

onMounted(() => {
  visible.value = true;
  startTimmer();
});

useEventListener(document, "keydown", (e: Event) => {
  const { code } = e as KeyboardEvent;
  if (code === "Escape") {
    close();
  }
});

watch(visible, (val) => {
  if (!val) boxHeight.value = -props.offset; // 退出动画更流畅
});

defineExpose({
  bottomOffset,
  close,
});
</script>

<template>
  <Transition
    :name="transitionName"
    @enter="boxHeight = messageRef!.getBoundingClientRect().height"
    @after-leave="!visible && onDestory()"
  >
    <div
      ref="messageRef"
      class="er-message"
      :class="{
        [`er-message--${type}`]: type,
        'is-close': showClose,
      }"
      :style="cssStyle"
      v-show="visible"
      role="alert"
      @mouseenter="clearTimer"
      @mouseleave="startTimmer"
    >
      <er-icon class="er-message__icon" :icon="iconName" />
      <div class="er-message__content">
        <slot>
          <render-vnode v-if="message" :vNode="message" />
        </slot>
      </div>
      <div class="er-message__close" v-if="showClose">
        <er-icon icon="xmark" @click.stop="close" />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
@import "./style.css";
</style>
