<script setup lang="ts">
import type {
  SelectProps,
  SelectEmits,
  SelectOptionProps,
  SelectStates,
  RenderLabelFunc
} from './types'
import type { TooltipInstance } from '../Tooltip/types'
import type { InputInstance } from '../Input/types'
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

const tooltipRef = ref<TooltipInstance | null>(null)
const inputRef = ref<InputInstance | null>(null)

const isDropdownVisible = ref(false)
const filteredOptions = ref(props.options ?? [])
const filteredChilds: Ref<VNode[]> = ref([])

const selectStates = reactive<SelectStates>({
  inputValue: initialOption?.label ?? '',
  selectedOption: initialOption,
  mouseHover: false,
  loading: false
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

const isNoData = computed(() => {
  if (!props.filterable) return false
  if (hasChildren.value && eq(size(filteredChilds.value), 0)) return true
  if (!hasChildren.value && eq(size(filteredOptions.value), 0)) return true
  return false
})

const showClear = computed(
  () =>
    props.clearable && selectStates.mouseHover && selectStates.inputValue !== ''
)

const handleFilterDebounce = debounce(handleFilter, timeout.value)

const setFilteredChilds: (opts: typeof childrenOptsions.value) => void =
  function (opts) {
    filteredChilds.value = map(opts, 'vNode')
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
  hasChildren
    ? generateFilterChilds(selectStates.inputValue)
    : generateFilterOptions(selectStates.inputValue)
}

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
  renderLabel
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
            <template v-for="item in filteredChilds" :key="item.key">
              <render-vnode :vNode="item" />
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
