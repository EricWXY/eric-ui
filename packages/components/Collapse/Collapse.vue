<script setup lang="ts">
import { ref, provide, watch } from "vue";
import { each } from "lodash-es";
import type {
  CollapseItemName,
  CollapseProps,
  CollapseEmits,
} from "./types";
import { debugWarn } from "@eric-ui/utils";
import { COLLAPSE_CTX_KEY } from "./constants";

const COMPONENT_NAME = "ErCollapse" as const;

defineOptions({
  name: COMPONENT_NAME,
});

const props = defineProps<CollapseProps>();
const emits = defineEmits<CollapseEmits>();
const activeNames = ref<CollapseItemName[]>(props.modelValue);

if (props.accordion && activeNames.value.length > 1) {
  debugWarn(COMPONENT_NAME, "accordion mode should only have one active item");
}

function handleItemClick(item: CollapseItemName) {
  let _activeNames = [...activeNames.value];
  // 手风琴模式
  if (props.accordion) {
    _activeNames = [_activeNames[0] === item ? "" : item];
    updateActiveNames(_activeNames);
    return;
  }

  const index = _activeNames.indexOf(item);
  if (index > -1) {
    // 存在，删除数组中的一项
    _activeNames.splice(index, 1);
  } else {
    // 不存在，插入对应 name
    _activeNames.push(item);
  }
  updateActiveNames(_activeNames);
}

function updateActiveNames(val: CollapseItemName[]) {
  activeNames.value = val;
  each(["update:modelValue", "change"], (e) =>
    emits(e as "update:modelValue" & "change", val)
  );
}

watch(
  () => props.modelValue,
  (val) => updateActiveNames(val)
);

provide(COLLAPSE_CTX_KEY, {
  activeNames,
  handleItemClick,
});
</script>

<template>
  <div class="er-collapse">
    <slot></slot>
  </div>
</template>

<style scoped>
@import "./style.css";
</style>
