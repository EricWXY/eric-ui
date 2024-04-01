<script setup lang="ts">
import { ref, provide, watch } from 'vue'
import { each } from 'lodash-es'
import type { NameType, CollapseProps, CollapseEmits } from './types'
import { collapseCtxKey } from './types'
defineOptions({
  name: 'ErCollapse'
})

const props = defineProps<CollapseProps>()
const emits = defineEmits<CollapseEmits>()
const activeNames = ref<NameType[]>(props.modelValue)
watch(
  () => props.modelValue,
  val => {
    activeNames.value = val
  }
)

if (props.accordion && activeNames.value.length > 1) {
  console.warn('accordion mode should only have one active item')
}

function handleItemClick(item: NameType) {
  let _activeNames = [...activeNames.value]
  // 手风琴模式
  if (props.accordion) {
    _activeNames = [_activeNames[0] === item ? '' : item]
    updateActiveNames(_activeNames)
    return
  }

  const index = _activeNames.indexOf(item)
  if (index > -1) {
    // 存在，删除数组中的一项
    _activeNames.splice(index, 1)
  } else {
    // 不存在，插入对应 name
    _activeNames.push(item)
  }
  updateActiveNames(_activeNames)
}

function updateActiveNames(val: NameType[]) {
  activeNames.value = val
  each(['update:modelValue', 'change'], e =>
    emits(e as 'update:modelValue' & 'change', val)
  )
}

provide(collapseCtxKey, {
  activeNames,
  handleItemClick
})
</script>

<template>
  <div class="er-collapse">
    <slot></slot>
  </div>
</template>

<style scoped>
@import './style.css';
</style>
