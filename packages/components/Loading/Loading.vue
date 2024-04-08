<script setup lang="ts">
import type { LoadingOptions } from './types'
import { computed } from 'vue'
import { isString } from 'lodash-es'
import ErIcon from '../Icon/Icon.vue'

defineOptions({
  name: 'ErLoading',
  inheritAttrs: false
})
const props = withDefaults(defineProps<LoadingOptions>(), {
  zIndex: 20000,
  visible: false
})

const iconName = computed(() => {
  if (isString(props.spinner)) {
    return props.spinner
  }
  return 'spinner' // 'circle-notch' 也很好看
})
</script>

<template>
  <transition name="er-loading-fade" @after-leave="onAfterLeave">
    <div
      v-show="visible"
      class="er-loading er-loading__mask"
      :class="{ 'is-fullscreen': fullscreen }"
    >
      <div class="er-loading__spinner">
        <er-icon v-if="props.spinner !== false" :icon="iconName" spin />
        <p v-if="text" class="er-loading-text">{{ text }}</p>
      </div>
    </div>
  </transition>
</template>

<style>
@import './style.css';
.er-loading {
  --er-loading-bg-color: v-bind(background) !important;
  --er-loading-z-index: v-bind(zIndex) !important;
}
</style>
