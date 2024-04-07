<script setup lang="ts">
import type { AlertProps, AlertEmits, AlertInstance } from './types'
import { ref, useSlots, computed } from 'vue'
import ErIcon from '../Icon/Icon.vue'

defineOptions({
  name: 'ErAlert'
})
const props = withDefaults(defineProps<AlertProps>(), {
  effect: 'light',
  closable: true,
  description: ''
})
const emits = defineEmits<AlertEmits>()
const slots = useSlots()

const visible = ref(true)

const iconMap = new Map([
  ['success', 'check-circle'],
  ['warning', 'circle-exclamation'],
  ['info', 'circle-info'],
  ['danger', 'circle-xmark']
])

const iconName = computed(() => iconMap.get(props.type) ?? 'circle-info')
const withDescription = computed(() => props.description || slots.default)

function close() {
  visible.value = false
  emits('close')
}

defineExpose<AlertInstance>({
  close
})
</script>

<template>
  <transition name="er-alert-fade">
    <div
      v-show="visible"
      class="er-alert"
      role="alert"
      :class="{
        [`er-alert__${type}`]: type,
        [`er-alert__${effect}`]: effect,
        'text-center': center
      }"
    >
      <er-icon
        v-if="showIcon"
        class="er-alert__icon"
        :class="{ 'big-icon': withDescription }"
        :icon="iconName"
      />
      <div class="er-alert__content">
        <span class="er-alert__title" :class="{ 'with-desc': withDescription }">
          <slot name="title">{{ title }}</slot>
        </span>
        <p class="er-alert__description">
          <slot>{{ description }}</slot>
        </p>
        <div class="er-alert__close" v-if="closable">
          <er-icon @click.stop="close" icon="xmark" />
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
@import './style.css';
</style>
