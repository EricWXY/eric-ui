<script setup lang="ts">
import {
  assign,
  find,
  get,
  each,
  noop,
  isFunction,
  filter,
  isNil,
  isBoolean,
  includes,
  map,
  size,
  eq,
  debounce,
} from "lodash-es";
import {
  ref,
  reactive,
  computed,
  onMounted,
  provide,
  useSlots,
  watch,
  h,
  nextTick,
  type Ref,
  type VNode,
} from "vue";
import type {
  SelectProps,
  SelectEmits,
  SelectOptionProps,
  SelectContext,
  SelectInstance,
  SelectStates,
} from "./types";
import type { TooltipInstance } from "../Tooltip/types";
import type { InputInstance } from "../Input/types";
import { RenderVnode, debugWarn } from "@eric-ui/utils";
import { useFocusController, useClickOutside } from "@eric-ui/hooks";
import { SELECT_CTX_KEY, POPPER_OPTIONS } from "./constants";
import { useFormItem, useFormDisabled, useFormItemInputId } from "../Form";

import useKeyMap from "./useKeyMap";
import ErTooltip from "../Tooltip/Tooltip.vue";
import ErIcon from "../Icon/Icon.vue";
import ErInput from "../Input/Input.vue";
import ErOption from "./Option.vue";

const COMPONENT_NAME = "ErSelect" as const;
defineOptions({
  name: COMPONENT_NAME,
});
const props = withDefaults(defineProps<SelectProps>(), {
  options: () => [],
});
const emits = defineEmits<SelectEmits>();

const initialOption = findOption(props.modelValue);

const selectRef = ref<HTMLElement>();
const tooltipRef = ref<TooltipInstance>();
const inputRef = ref<InputInstance>();

const isDropdownVisible = ref(false);
const filteredOptions = ref(props.options ?? []);
const filteredChilds: Ref<Map<VNode, SelectOptionProps>> = ref(new Map());

const selectStates = reactive<SelectStates>({
  inputValue: initialOption?.label ?? "",
  selectedOption: initialOption,
  mouseHover: false,
  loading: false,
  highlightedIndex: -1,
});

const slots = useSlots();
const isDisabled = useFormDisabled();
const { formItem } = useFormItem();
const { inputId } = useFormItemInputId(props, formItem);
const {
  wrapperRef: inputWrapperRef,
  isFocused,
  handleBlur,
  handleFocus,
} = useFocusController(inputRef);

useClickOutside(selectRef, (e) => handleClickOutsie(e));

const highlightedLine = computed(() => {
  let result: SelectOptionProps | void;
  if (hasChildren.value) {
    const node = [...filteredChilds.value][selectStates.highlightedIndex]?.[0];
    result = filteredChilds.value.get(node);
  } else {
    result = filteredOptions.value[selectStates.highlightedIndex];
  }
  return result;
});

const children = computed(() =>
  filter(slots?.default?.(), (child) => eq(child.type, ErOption))
);

const hasChildren = computed(() => size(children.value) > 0);
const childrenOptsions = computed(() => {
  if (!hasChildren.value) return [];
  return map(children.value, (item) => ({
    vNode: h(item),
    props: assign(item.props, {
      disabled:
        item.props?.disabled === true ||
        (!isNil(item.props?.disabled) && !isBoolean(item.props?.disabled)),
    }),
  }));
});

const filterPlaceholder = computed(() => {
  return props.filterable &&
    selectStates.selectedOption &&
    isDropdownVisible.value
    ? selectStates.selectedOption.label
    : props.placeholder;
});

const timeout = computed(() => (props.remote ? 300 : 0));

const hasData = computed(
  () =>
    (hasChildren.value && filteredChilds.value.size > 0) ||
    (!hasChildren.value && size(filteredOptions.value) > 0)
);

const isNoData = computed(() => {
  if (!props.filterable) return false;
  if (!hasData.value) return true;
  return false;
});

const lastIndex = computed(() =>
  hasChildren.value
    ? filteredChilds.value.size - 1
    : size(filteredOptions.value) - 1
);

const showClear = computed(
  () =>
    props.clearable && selectStates.mouseHover && selectStates.inputValue !== ""
);

const handleFilterDebounce = debounce(handleFilter, timeout.value);

const keyMap = useKeyMap({
  isDropdownVisible,
  controlVisible,
  selectStates,
  highlightedLine,
  handleSelect,
  hasData,
  lastIndex,
});

const focus: SelectInstance["focus"] = function () {
  inputRef.value?.focus();
};

const blur: SelectInstance["blur"] = function () {
  handleClickOutsie();
};

function setFilteredChilds(opts: typeof childrenOptsions.value) {
  filteredChilds.value.clear();
  each(opts, (item) => {
    filteredChilds.value.set(item.vNode, item.props as SelectOptionProps);
  });
}

function renderLabel(opt: SelectOptionProps): VNode | string {
  if (isFunction(props.renderLabel)) {
    return props.renderLabel(opt);
  }
  return opt.label;
}

function controlVisible(visible: boolean) {
  if (!tooltipRef.value) return;
  get(tooltipRef, ["value", visible ? "show" : "hide"])?.();
  props.filterable && controlInputVal(visible);
  isDropdownVisible.value = visible;
  emits("visible-change", visible);

  selectStates.highlightedIndex = -1;
}
function controlInputVal(visible: boolean) {
  if (!props.filterable) return;
  if (visible) {
    if (selectStates.selectedOption) selectStates.inputValue = "";
    handleFilterDebounce();
  } else {
    selectStates.inputValue = selectStates.selectedOption?.label || "";
  }
}
function toggleVisible() {
  if (isDisabled.value) return;
  controlVisible(!isDropdownVisible.value);
}

function findOption(value: string) {
  return find(props.options, (option) => option.value === value);
}

function handleClickOutsie(e?: Event) {
  if (isFocused.value) {
    nextTick(() => handleBlur(new FocusEvent("focus", e)));
  }
}

function handleSelect(o: SelectOptionProps) {
  if (o.disabled) return;

  selectStates.inputValue = o.label;
  selectStates.selectedOption = o;
  each(["change", "update:modelValue"], (k) => emits(k as any, o.value));
  controlVisible(false);
  inputRef.value?.focus();
}

function setSelected() {
  const option = findOption(props.modelValue);
  if (!option) return;
  selectStates.inputValue = option.label;
  selectStates.selectedOption = option;
}

function handleClear() {
  inputRef.value?.clear();
  selectStates.inputValue = "";
  selectStates.selectedOption = null;

  emits("clear");
  each(["change", "update:modelValue"], (k) => emits(k as any, ""));
  formItem?.clearValidate();
}

async function callRemoteMethod(method: Function, search: string) {
  if (!method || !isFunction(method)) return;

  selectStates.loading = true;
  let result;
  try {
    result = await method(search);
  } catch (error) {
    debugWarn(error as Error);
    debugWarn(COMPONENT_NAME, "callRemoteMethod error");
    result = [];
    return Promise.reject(error);
  } finally {
    selectStates.loading = false;
  }
  return result;
}

async function genFilterOptions(search: string) {
  if (!props.filterable) return;

  if (props.remote && props.remoteMethod && isFunction(props.remoteMethod)) {
    filteredOptions.value = await callRemoteMethod(props.remoteMethod, search);
    return;
  }

  if (props.filterMethod && isFunction(props.filterMethod)) {
    filteredOptions.value = props.filterMethod(search);
    return;
  }

  filteredOptions.value = filter(props.options, (opt) =>
    includes(opt.label, search)
  );
}

async function genFilterChilds(search: string) {
  if (!props.filterable) return;

  if (props.remote && props.remoteMethod && isFunction(props.remoteMethod)) {
    await callRemoteMethod(props.remoteMethod, search);
    setFilteredChilds(childrenOptsions.value);
    return;
  }
  if (props.filterMethod && isFunction(props.filterMethod)) {
    const options = map(props.filterMethod(search), "value");
    setFilteredChilds(
      filter(childrenOptsions.value, (item) =>
        includes(options, get(item, ["props", "value"]))
      )
    );
    return;
  }
  setFilteredChilds(
    filter(childrenOptsions.value, (item) =>
      includes(get(item, ["props", "label"]), search)
    )
  );
}

function handleFilter() {
  const searchKey = selectStates.inputValue;
  selectStates.highlightedIndex = -1;

  if (hasChildren.value) {
    genFilterChilds(searchKey);
    return;
  }
  genFilterOptions(searchKey);
}

function handleKeyDown(e: KeyboardEvent) {
  keyMap.has(e.key) && keyMap.get(e.key)?.(e);
}

watch(
  () => props.options,
  (newOpts) => {
    filteredOptions.value = newOpts ?? [];
  }
);

watch(
  () => childrenOptsions.value,
  (newOpts) => setFilteredChilds(newOpts),
  { immediate: true }
);

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      formItem?.validate("change").catch((err) => debugWarn(err));
    }
    setSelected();
  }
);

onMounted(() => {
  setSelected();
});

provide<SelectContext>(SELECT_CTX_KEY, {
  handleSelect,
  selectStates,
  renderLabel,
  highlightedLine,
});

defineExpose<SelectInstance>({
  focus,
  blur,
});
</script>

<template>
  <div
    ref="selectRef"
    class="er-select"
    :class="{
      'is-disabled': isDisabled,
    }"
    @click.stop="toggleVisible"
    @mouseenter="selectStates.mouseHover = true"
    @mouseleave="selectStates.mouseHover = false"
  >
    <er-tooltip
      ref="tooltipRef"
      placement="bottom-start"
      :popper-options="POPPER_OPTIONS"
      @click-outside="controlVisible(false)"
      manual
    >
      <template #default>
        <div ref="inputWrapperRef">
          <er-input
            ref="inputRef"
            v-model="selectStates.inputValue"
            :id="inputId"
            :disabled="isDisabled"
            :placeholder="filterable ? filterPlaceholder : placeholder"
            :readonly="!filterable || !isDropdownVisible"
            @focus="handleFocus"
            @blur="handleBlur"
            @input="handleFilterDebounce"
            @keydown="handleKeyDown"
          >
            <template #suffix>
              <er-icon
                v-if="showClear"
                icon="circle-xmark"
                class="er-input__clear"
                @click.stop="handleClear"
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
        </div>
      </template>
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
            <template
              v-for="[vNode, _props] in filteredChilds"
              :key="_props.value"
            >
              <render-vnode :vNode="vNode" />
            </template>
          </template>
        </ul>
      </template>
    </er-tooltip>
  </div>
</template>

<style scoped>
@import "./style.css";
</style>
