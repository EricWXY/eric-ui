<script setup lang="ts">
import { type MenuOption, dropdownCtxKey } from './types'
import { inject } from 'vue'

defineOptions({
  name: 'ErDropdownItem'
})
defineProps<MenuOption>()

const ctx = inject(dropdownCtxKey)
</script>

<template>
  <li v-if="divided" role="separator" class="divided-placeholder"></li>
  <li
    :id="`dropdown-item-${name}`"
    :class="{
      'er-dropdown__item': true,
      'is-disabled': disabled,
      'is-divided': divided
    }"
    @click="ctx?.handleItemClick($props)"
  >
    <slot>
      {{ label }}
    </slot>
  </li>
</template>

<style>
@import './style.css';
</style>
