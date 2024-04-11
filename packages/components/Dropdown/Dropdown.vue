<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import { omit, isNil } from 'lodash-es'
import type {
  DropdownProps,
  DropdownEmits,
  DropdownInstance,
  MenuOption,
  DropdownContext
} from './types'
import { DROPDOWN_CTX_KEY } from './constants'
import type { TooltipInstance } from '../Tooltip/types'
import { useId } from '@eric-ui/hooks'

import DropdownItem from './DropdownItem.vue'
import Tooltip from '../Tooltip/Tooltip.vue'

defineOptions({
  name: 'ErDropdown',
  inheritAttrs: false
})
const props = withDefaults(defineProps<DropdownProps>(), {
  hideOnClick: true,
  menuOptions: () => [] as MenuOption[]
})
const emits = defineEmits<DropdownEmits>()
const tooltipRef = ref<TooltipInstance | null>(null)

const tooltipProps = computed(() =>
  omit(props, ['menuOptions', 'hideAfterClick'])
)

function handleItemClick(e: MenuOption) {
  if ((e as MenuOption).disabled) return
  props.hideOnClick && tooltipRef.value?.hide()
  !isNil(e.command) && emits('command', e.command)
}

defineExpose<DropdownInstance>({
  handleOpen: () => tooltipRef.value?.show(),
  handleClose: () => tooltipRef.value?.hide()
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
            <template
              v-for="item in items"
              :key="item.command ?? useId().value"
            >
              <dropdown-item v-bind="item" />
            </template>
          </slot>
        </ul>
      </template>
    </tooltip>
  </div>
</template>

<style scoped>
@import './style.css';
</style>
