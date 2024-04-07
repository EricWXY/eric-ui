<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { SwitchEmits, SwitchProps } from './types'
import { useFormItem } from '../Form'

defineOptions({ name: 'ErSwitch', inheritAttrs: false })
const props = withDefaults(defineProps<SwitchProps>(), {
  activeValue: true,
  inactiveValue: false
})
const emits = defineEmits<SwitchEmits>()
const { formItem } = useFormItem()

const innerValue = ref(props.modelValue)
const inputRef = ref<HTMLInputElement | null>(null)
const checked = computed(() => innerValue.value === props.activeValue)

function handleChange() {
  if (props.disabled) return

  const newVal = checked.value ? props.inactiveValue : props.activeValue

  innerValue.value = newVal
  emits('update:modelValue', newVal)
  emits('change', newVal)
  formItem?.validate('change')
}

onMounted(() => {
  inputRef.value!.checked = checked.value
})
watch(checked, val => (inputRef.value!.checked = val))
watch(
  () => props.modelValue,
  val => (innerValue.value = val)
)
</script>

<template>
  <div
    class="er-switch"
    :class="{
      [`er-switch--${size}`]: size,
      'is-disabled': disabled,
      'is-checked': checked
    }"
    @click="handleChange"
  >
    <input
      class="er-switch__input"
      type="checkbox"
      role="switch"
      ref="inputRef"
      :name="name"
      :disabled="disabled"
      :checked="checked"
      @keydown.enter="handleChange"
      @blur="formItem?.validate('blur')"
    />
    <div class="er-switch__core">
      <div class="er-switch__core-inner">
        <span
          v-if="activeText || inactiveText"
          class="er-switch__core-inner-text"
        >
          {{ checked ? activeText : inactiveText }}
        </span>
      </div>
      <div class="er-switch__core-action"></div>
    </div>
  </div>
</template>

<style scoped>
@import './style.css';
</style>
