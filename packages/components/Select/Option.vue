<script setup lang="ts">
import type { SelectOptionProps } from './types'
import { SELECT_CTX_KEY } from './constants'
import { computed, inject } from 'vue'

defineOptions({
  name: 'ErOption'
})
const props = defineProps<SelectOptionProps>()
const ctx = inject(SELECT_CTX_KEY)
const selected = computed(
  () => ctx?.selectStates?.selectedOption?.value === props.value
)
</script>

<template>
  <li
    class="er-select__menu-item"
    :class="{ 'is-disabled': disabled, 'is-selected': selected }"
    :id="`select-item-${value}`"
    @click.stop="() => ctx?.handleItemSelect($props)"
  >
    {{ label }}
  </li>
</template>

<style scoped>
@import './style.css';
</style>
