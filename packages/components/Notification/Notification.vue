<script setup lang="ts">
import type { NotificationProps } from './types'
import { typeIconMap } from '../common'
import { ref, computed, onMounted } from 'vue'
import { getLastBottomOffset } from './methods'
import { delay, isString } from 'lodash-es'
import { RenderVnode } from '@eric-ui/utils'

import ErIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<NotificationProps>(), {
  type: 'info',
  duration: 3000,
  offset: 20,
  transitionName: 'fade',
  showClose: true
})
const visible = ref(false)
const notifyRef = ref<HTMLDivElement>()

const iconName = computed(() => {
  if (isString(props.icon)) return props.icon
  return typeIconMap.get(props.type)
})

// 这个 div 的高度
const boxHeight = ref(0)
// 上一个实例的最下面的坐标数字，第一个是 0
const lastBottomOffset = computed(() => getLastBottomOffset(props.id))
// 这个元素应该使用的 top
const topOffset = computed(() => props.offset + lastBottomOffset.value)
// 这个元素为下一个元素预留的 offset，也就是它最低端 bottom 的 值
const bottomOffset = computed(() => boxHeight.value + topOffset.value)
const cssStyle = computed(() => ({
  top: topOffset.value + 'px',
  zIndex: props.zIndex
}))

let timer: any

function startTimer() {
  if (props.duration === 0) return
  timer = delay(close, props.duration)
}
function clearTimer() {
  clearTimeout(timer)
}

function close() {
  visible.value = false
}

onMounted(() => {
  visible.value = true
  startTimer()
})
defineExpose({
  close,
  bottomOffset
})
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
        'show-close': showClose
      }"
      :style="cssStyle"
      v-show="visible"
      role="alert"
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
@import './style.css';
</style>
