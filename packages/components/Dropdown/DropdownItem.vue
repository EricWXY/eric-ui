<script setup lang="ts">
import { type MenuOption } from './types'
import { DROPDOWN_CTX_KEY } from './constants'
import { inject } from 'vue'

defineOptions({
  name: 'ErDropdownItem'
})
const props = defineProps<MenuOption>()

const ctx = inject(DROPDOWN_CTX_KEY)

function handleClick() {
  ctx?.handleItemClick(props)
}
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
    @click="handleClick"
  >
    <slot>
      {{ label }}
    </slot>
  </li>
</template>

<style>
@import './style.css';
</style>
