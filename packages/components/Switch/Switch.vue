<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import type { SwitchEmits, SwitchProps, SwitchInstance } from "./types";
import { debugWarn } from "@eric-ui/utils";
import { useFormItem, useFormDisabled, useFormItemInputId } from "../Form";

defineOptions({ name: "ErSwitch", inheritAttrs: false });
const props = withDefaults(defineProps<SwitchProps>(), {
  activeValue: true,
  inactiveValue: false,
});
const emits = defineEmits<SwitchEmits>();
const isDisabled = useFormDisabled();
const { formItem } = useFormItem();
const { inputId } = useFormItemInputId(props, formItem);

const innerValue = ref(props.modelValue);
const inputRef = ref<HTMLInputElement | null>(null);
const checked = computed(() => innerValue.value === props.activeValue);

const focus: SwitchInstance["focus"] = function () {
  inputRef.value?.focus();
};

function handleChange() {
  if (isDisabled.value) return;

  const newVal = checked.value ? props.inactiveValue : props.activeValue;

  innerValue.value = newVal;
  emits("update:modelValue", newVal);
  emits("change", newVal);
}

onMounted(() => {
  inputRef.value!.checked = checked.value;
});
watch(checked, (val) => {
  inputRef.value!.checked = val;
  formItem?.validate("change").catch((err) => debugWarn(err));
});
watch(
  () => props.modelValue,
  (val) => (innerValue.value = val)
);

defineExpose<SwitchInstance>({
  focus,
  checked,
});
</script>

<template>
  <div
    class="er-switch"
    :class="{
      [`er-switch--${size}`]: size,
      'is-disabled': isDisabled,
      'is-checked': checked,
    }"
    @click="handleChange"
  >
    <input
      class="er-switch__input"
      type="checkbox"
      role="switch"
      ref="inputRef"
      :id="inputId"
      :name="name"
      :disabled="isDisabled"
      :checked="checked"
      @keydown.enter="handleChange"
      @blur="formItem?.validate('blur').catch((err) => debugWarn(err))"
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
@import "./style.css";
</style>
