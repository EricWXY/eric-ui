<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import { omit } from 'lodash-es'
import type {
  DropdownProps,
  DropdownEmits,
  DropdownInstance,
  MenuOption,
  DropdownContext
} from './types'
import { DROPDOWN_CTX_KEY } from './constants'
import type { TooltipInstance } from '../Tooltip/types'

import DropdownItem from './DropdownItem.vue'
import Tooltip from '../Tooltip/Tooltip.vue'

defineOptions({
  name: 'ErDropdown',
  inheritAttrs: false
})
const props = withDefaults(defineProps<DropdownProps>(), {
  hideAfterClick: true,
  menuOptions: () => [] as MenuOption[]
})
const emits = defineEmits<DropdownEmits>()
const tooltipRef = ref<TooltipInstance | null>(null)

const tooltipProps = computed(() =>
  omit(props, ['menuOptions', 'hideAfterClick'])
)

function handleItemClick(e: unknown) {
  if ((e as MenuOption).disabled) return
  emits('select', e as MenuOption)
  props.hideAfterClick && tooltipRef.value?.hide()
}

defineExpose<DropdownInstance>({
  show: () => tooltipRef.value?.show(),
  hide: () => tooltipRef.value?.hide()
})

provide<DropdownContext>(DROPDOWN_CTX_KEY, {
  handleItemClick
})
</script>

<template>
  <div class="er-dropdown">
    <tooltip
      v-bind="tooltipProps"
      @visible-change="$emit('visible-change', $event)"
      ref="tooltipRef"
    >
      <slot></slot>
      <template #content>
        <ul class="er-dropdown__menu">
          <slot name="dropdown">
            <template v-for="item in menuOptions" :key="item.name">
              <dropdown-item v-bind="item" />
            </template>
          </slot>
        </ul>
      </template>
    </tooltip>
  </div>
</template>

<style>
@import './style.css';
</style>
