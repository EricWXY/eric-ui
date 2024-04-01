<script setup lang="ts">
import { inject, computed } from 'vue'
import transitionEvents from './transitionEvents'
import { type CollapseItemProps, collapseCtxKey } from './types'
import ErIcon from '../Icon/Icon.vue'

defineOptions({
  name: 'ErCollapseItem'
})

const props = defineProps<CollapseItemProps>()

const ctx = inject(collapseCtxKey)

const isActive = computed(() => ctx?.activeNames.value.includes(props.name))

function handleClick() {
  if (props.disabled) return
  ctx?.handleItemClick(props.name)
}
</script>

<template>
  <div
    class="er-collapse-item"
    :class="{
      'is-disabled': disabled
    }"
  >
    <div
      class="er-collapse-item__header"
      :id="`item-header-${name}`"
      :class="{
        'is-disabled': disabled,
        'is-active': isActive
      }"
      @click="handleClick"
    >
      <slot name="title">
        {{ title }}
      </slot>
      <er-icon icon="angle-right" class="header-angle" />
    </div>
    <transition name="slide" v-on="transitionEvents">
      <div class="er-collapse-item__wapper" v-show="isActive">
        <div class="er-collapse-item__content" :id="`item-content-${name}`">
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
@import './style.css';
</style>
