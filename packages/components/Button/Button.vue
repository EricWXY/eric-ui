<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ButtonProps } from './types'
import ErIcon from '../Icon/Icon.vue'
defineOptions({
  name: 'ErButton'
})
withDefaults(defineProps<ButtonProps>(), {
  tag: 'button',
  nativeType: 'button'
})
const slots = defineSlots()

const _ref = ref<HTMLButtonElement>()
const iconStyle = computed(() => ({
  marginRight: slots.default ? '6px' : '0px'
}))

defineExpose({
  ref: _ref
})
</script>

<template>
  <component
    :is="tag"
    ref="_ref"
    class="er-button"
    :class="{
      [`er-button--${type}`]: type,
      [`er-button--${size}`]: size,
      'is-plain': plain,
      'is-round': round,
      'is-circle': circle,
      'is-disabled': disabled,
      'is-loading': loading
    }"
    :disabled="disabled || loading ? true : void 0"
    :type="tag === 'button' ? nativeType : void 0"
    :autofocus="autofocus"
  >
    <slot name="loading">
      <er-icon
        :icon="loadingIcon ?? 'spinner'"
        size="1x"
        :style="iconStyle"
        spin
        v-if="loading"
      />
    </slot>
    <er-icon :icon="icon" size="1x" :style="iconStyle" v-if="icon" />
    <slot></slot>
  </component>
</template>

<style scoped>
@import './style.css';
</style>
