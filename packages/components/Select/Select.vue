<script setup lang="ts">
import type {
  SelectProps,
  SelectEmits,
  SelectOptionProps,
  SelectStates
} from './types'
import type { TooltipInstance } from '../Tooltip/types'
import { ref, reactive, provide } from 'vue'
import { find, get } from 'lodash-es'
import { SELECT_CTX_KEY } from './constants'
import ErTooltip from '../Tooltip/Tooltip.vue'
import ErInput from '../Input/Input.vue'
import ErOption from './Option.vue'

defineOptions({
  name: 'ErSelect'
})
const props = defineProps<SelectProps>()
const emits = defineEmits<SelectEmits>()

const tooltipRef = ref<TooltipInstance | null>(null)
const initialOption = findOption(props.modelValue)

const isDropdownVisible = ref(false)
const popperOptions: any = {
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, 9]
      }
    },
    {
      name: 'sameWidth',
      enabled: true,
      fn: ({ state }: { state: any }) => {
        state.styles.popper.width = `${state.rects.reference.width}px`
      },
      phase: 'beforeWrite',
      requires: ['computeStyles']
    }
  ]
}
const states = reactive<SelectStates>({
  inputValue: initialOption?.label ?? '',
  selectedOption: initialOption
})

function controlDropdown(visible: boolean) {
  if (!tooltipRef.value) return
  get(tooltipRef, ['value', visible ? 'show' : 'hide'])?.()
  isDropdownVisible.value = visible
  emits('visible-change', visible)
}
function toggleDropdown() {
  if (props.disabled) return
  controlDropdown(!isDropdownVisible.value)
}

function findOption(value: string) {
  return find(props.options, option => option.value === value)
}

function handleItemSelect(o: SelectOptionProps) {
  if (o.disabled) return

  states.inputValue = o.label
  states.selectedOption = o
  emits('change', o.value)
  emits('update:modelValue', o.value)
  controlDropdown(false)
}

provide(SELECT_CTX_KEY, {
  handleItemSelect,
  selectStates: states
})
</script>

<template>
  <div
    class="er-select"
    :class="{
      'is-disabled': disabled
    }"
    @click="toggleDropdown"
  >
    <er-tooltip
      ref="tooltipRef"
      placement="bottom-start"
      :popper-options="popperOptions"
      manual
    >
      <er-input
        v-model="states.inputValue"
        :disabled="disabled"
        :placeholder="placeholder"
        readonly
      />
      <template #content>
        <ul class="er-select__menu">
          <slot>
            <er-option
              v-for="item in options"
              :key="item.value"
              v-bind="item"
            />
          </slot>
        </ul>
      </template>
    </er-tooltip>
  </div>
</template>

<style scoped>
@import './style.css';
</style>
