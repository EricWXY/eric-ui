<script setup lang="ts">
import {
  find,
  get,
  each,
  noop,
  isFunction,
  filter,
  includes,
  map,
  size,
  eq,
  debounce
} from 'lodash-es'
import {
  ref,
  reactive,
  computed,
  onMounted,
  provide,
  useSlots,
  watch,
  h,
  type Ref,
  type VNode
} from 'vue'
import type {
  SelectProps,
  SelectEmits,
  SelectOptionProps,
  SelectStates,
  RenderLabelFunc
} from './types'
import type { TooltipInstance } from '../Tooltip/types'
import type { InputInstance } from '../Input/types'
import { RenderVnode } from '@eric-ui/utils'
import { SELECT_CTX_KEY } from './constants'

import ErTooltip from '../Tooltip/Tooltip.vue'
import ErIcon from '../Icon/Icon.vue'
import ErInput from '../Input/Input.vue'
import ErOption from './Option.vue'

defineOptions({
  name: 'ErSelect'
})
const props = withDefaults(defineProps<SelectProps>(), {
  options: () => []
})
const emits = defineEmits<SelectEmits>()
const slots = useSlots()

const initialOption = findOption(props.modelValue)

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

const keyMap: Map<string, Function> = new Map()

const tooltipRef = ref<TooltipInstance | null>(null)
const inputRef = ref<InputInstance | null>(null)

const isDropdownVisible = ref(false)
const filteredOptions = ref(props.options ?? [])
const filteredChilds: Ref<Map<VNode, SelectOptionProps>> = ref(new Map())

const selectStates = reactive<SelectStates>({
  inputValue: initialOption?.label ?? '',
  selectedOption: initialOption,
  mouseHover: false,
  loading: false,
  highlightedIndex: -1
})

const highlightedLine = computed(() => {
  let result: SelectOptionProps | undefined = undefined
  if (hasChildren.value) {
    const node = [...filteredChilds.value][selectStates.highlightedIndex]?.[0]
    result = filteredChilds.value.get(node)
  } else {
    result = filteredOptions.value[selectStates.highlightedIndex]
  }
  return result
})

const children = computed(() =>
  filter(slots?.default?.(), child => eq(child.type, ErOption))
)

const hasChildren = computed(() => size(children.value) > 0)
const childrenOptsions = computed(() => {
  if (!hasChildren.value) return []
  return map(children.value, item => ({ vNode: h(item), props: item.props }))
})

const filterPlaceholder = computed(() => {
  return props.filterable &&
    selectStates.selectedOption &&
    isDropdownVisible.value
    ? selectStates.selectedOption.label
    : props.placeholder
})

const timeout = computed(() => (props.remote ? 300 : 0))

const hasData = computed(
  () =>
    (hasChildren.value && filteredChilds.value.size > 0) ||
    (!hasChildren.value && size(filteredOptions.value) > 0)
)

const isNoData = computed(() => {
  if (!props.filterable) return false
  if (!hasData.value) return true
  return false
})

const lastIndex = computed(() =>
  hasChildren.value
    ? filteredChilds.value.size - 1
    : size(filteredOptions.value) - 1
)

const showClear = computed(
  () =>
    props.clearable && selectStates.mouseHover && selectStates.inputValue !== ''
)

const handleFilterDebounce = debounce(handleFilter, timeout.value)

const setFilteredChilds: (opts: typeof childrenOptsions.value) => void =
  function (opts) {
    filteredChilds.value.clear()
    each(opts, item =>
      filteredChilds.value.set(item.vNode, item.props as SelectOptionProps)
    )
  }

const renderLabel: RenderLabelFunc = function (opt) {
  if (isFunction(props.renderLabel)) {
    return props.renderLabel(opt)
  }
  return opt.label
}

function controlVisible(visible: boolean) {
  if (!tooltipRef.value) return
  get(tooltipRef, ['value', visible ? 'show' : 'hide'])?.()
  props.filterable && controlInputVal(visible)
  isDropdownVisible.value = visible
  emits('visible-change', visible)

  selectStates.highlightedIndex = -1
}
function controlInputVal(visible: boolean) {
  if (!props.filterable) return
  if (visible) {
    if (selectStates.selectedOption) selectStates.inputValue = ''
    handleFilterDebounce()
  } else {
    selectStates.inputValue = selectStates.selectedOption?.label || ''
  }
}
function toggleVisible() {
  if (props.disabled) return
  controlVisible(!isDropdownVisible.value)
}

function findOption(value: string) {
  return find(props.options, option => option.value === value)
}

function handleSelect(o: SelectOptionProps) {
  if (o.disabled) return

  selectStates.inputValue = o.label
  selectStates.selectedOption = o
  each(['change', 'update:modelValue'], k => emits(k as any, o.value))
  controlVisible(false)
  inputRef.value?.ref?.focus()
}

function handleClear() {
  inputRef.value?.clear()
  selectStates.inputValue = ''
  selectStates.selectedOption = null

  emits('clear')
  each(['change', 'update:modelValue'], k => emits(k as any, ''))
}

async function generateFilterOptions(search: string) {
  if (!props.filterable) return

  if (props.remote && props.remoteMethod && isFunction(props.remoteMethod)) {
    selectStates.loading = true
    try {
      filteredOptions.value = (await props.remoteMethod(search)) ?? []
    } catch (error) {
      console.error(error)
      filteredOptions.value = []
    } finally {
      selectStates.loading = false
    }
    return
  }

  if (props.filterMethod && isFunction(props.filterMethod)) {
    filteredOptions.value = props.filterMethod(search)
    return
  }

  filteredOptions.value = filter(props.options, opt =>
    includes(opt.label, search)
  )
}

async function generateFilterChilds(search: string) {
  if (!props.filterable) return

  if (props.remote && props.remoteMethod && isFunction(props.remoteMethod)) {
    selectStates.loading = true
    try {
      await props.remoteMethod(search)
    } catch (error) {
      console.error(error)
    } finally {
      selectStates.loading = false
    }
    setFilteredChilds(childrenOptsions.value)
    return
  }
  if (props.filterMethod && isFunction(props.filterMethod)) {
    const options = map(props.filterMethod(search), 'value')
    setFilteredChilds(
      filter(childrenOptsions.value, item =>
        includes(options, item?.props?.value)
      )
    )
    return
  }
  setFilteredChilds(
    filter(childrenOptsions.value, item =>
      includes(get(item, ['props', 'label']), search)
    )
  )
}

function handleFilter() {
  const searchKey = selectStates.inputValue
  selectStates.highlightedIndex = -1

  if (hasChildren.value) {
    generateFilterChilds(searchKey)
    return
  }
  generateFilterOptions(searchKey)
}

function handleKeyDown(e: KeyboardEvent) {
  keyMap.has(e.key) && keyMap.get(e.key)?.(e)
}

keyMap.set('Enter', () => {
  if (!isDropdownVisible.value) {
    controlVisible(true)
  } else {
    if (selectStates.highlightedIndex >= 0 && highlightedLine.value) {
      handleSelect(highlightedLine.value)
    } else {
      controlVisible(false)
    }
  }
})
keyMap.set(
  'Escape',
  () => isDropdownVisible.value && controlVisible(!isDropdownVisible.value)
)
keyMap.set('ArrowUp', (e: KeyboardEvent) => {
  e.preventDefault()

  if (!hasData.value) return
  if (
    selectStates.highlightedIndex === -1 ||
    selectStates.highlightedIndex === 0
  ) {
    selectStates.highlightedIndex = lastIndex.value
  } else {
    selectStates.highlightedIndex--
  }
})

keyMap.set('ArrowDown', (e: KeyboardEvent) => {
  e.preventDefault()
  if (!hasData.value) return
  if (
    selectStates.highlightedIndex === -1 ||
    selectStates.highlightedIndex === lastIndex.value
  ) {
    selectStates.highlightedIndex = 0
  } else {
    selectStates.highlightedIndex++
  }
})

watch(
  () => props.options,
  newOpts => {
    filteredOptions.value = newOpts ?? []
  }
)

watch(
  () => childrenOptsions.value,
  newOpts => setFilteredChilds(newOpts)
)

onMounted(() => setFilteredChilds(childrenOptsions.value))

provide(SELECT_CTX_KEY, {
  handleSelect,
  selectStates,
  renderLabel,
  highlightedLine
})
</script>

<template>
  <div
    class="er-select"
    :class="{
      'is-disabled': disabled
    }"
    @click="toggleVisible"
    @mouseenter="selectStates.mouseHover = true"
    @mouseleave="selectStates.mouseHover = false"
  >
    <er-tooltip
      ref="tooltipRef"
      placement="bottom-start"
      :popper-options="popperOptions"
      @click-outside="controlVisible(false)"
      manual
    >
      <er-input
        ref="inputRef"
        v-model="selectStates.inputValue"
        :disabled="disabled"
        :placeholder="filterable ? filterPlaceholder : placeholder"
        :readonly="!filterable || !isDropdownVisible"
        @input="handleFilterDebounce"
        @keydown="handleKeyDown"
      >
        <template #suffix>
          <er-icon
            v-if="showClear"
            icon="circle-xmark"
            class="er-input__clear"
            @click="handleClear"
            @mousedown.prevent="noop"
          />
          <er-icon
            v-else
            class="header-angle"
            icon="angle-down"
            :class="{ 'is-active': isDropdownVisible }"
          />
        </template>
      </er-input>
      <template #content>
        <div class="er-select__loading" v-if="selectStates.loading">
          <er-icon icon="spinner" spin />
        </div>
        <div class="er-select__nodata" v-else-if="filterable && isNoData">
          No data
        </div>
        <ul class="er-select__menu" v-else>
          <template v-if="!hasChildren">
            <er-option
              v-for="item in filteredOptions"
              :key="item.value"
              v-bind="item"
            />
          </template>
          <template v-else>
            <template v-for="[vNode, _] in filteredChilds" :key="vNode">
              <render-vnode :vNode="vNode" />
            </template>
          </template>
        </ul>
      </template>
    </er-tooltip>
  </div>
</template>

<style scoped>
@import './style.css';
</style>
