<script setup lang="ts">
import { computed, ref, watch, useAttrs, shallowRef, nextTick } from "vue";
import type { InputProps, InputEmits, InputInstance } from "./types";
import { useFormItem, useFormDisabled, useFormItemInputId } from "../Form";
import { debugWarn } from "@eric-ui/utils";
import { useFocusController } from "@eric-ui/hooks";
import { each, noop } from "lodash-es";
import Icon from "../Icon/Icon.vue";

defineOptions({
  name: "ErInput",
  inheritAttrs: false,
});
const props = withDefaults(defineProps<InputProps>(), {
  type: "text",
  autocomplete: "off",
});
const emits = defineEmits<InputEmits>();

const innerValue = ref(props.modelValue);
const passwordVisible = ref(false);

const inputRef = shallowRef<HTMLInputElement>();
const textareaRef = shallowRef<HTMLTextAreaElement>();

const showClear = computed(
  () =>
    props.clearable &&
    !!innerValue.value &&
    !isDisabled.value &&
    isFocused.value
);

const showPasswordArea = computed(
  () =>
    props.type === "password" &&
    props.showPassword &&
    !isDisabled.value &&
    !!innerValue.value
);

const _ref = computed(() => inputRef.value || textareaRef.value);

const attrs = useAttrs();
const isDisabled = useFormDisabled();
const { formItem } = useFormItem();
const { inputId } = useFormItemInputId(props, formItem);
const { wrapperRef, isFocused, handleFocus, handleBlur } = useFocusController(
  _ref,
  {
    afterBlur() {
      formItem?.validate("blur").catch((err) => debugWarn(err));
    },
  }
);

const clear: InputInstance["clear"] = function () {
  innerValue.value = "";
  each(["update:modelValue", "input", "change"], (e) => emits(e as any, ""));
  emits("clear");
  formItem?.clearValidate();
};

const focus: InputInstance["focus"] = async function () {
  await nextTick();
  _ref.value?.focus();
};

const blur: InputInstance["blur"] = function () {
  _ref.value?.blur();
};

const select: InputInstance["select"] = function () {
  _ref.value?.select();
};

function handleInput() {
  emits("update:modelValue", innerValue.value);
  emits("input", innerValue.value);
}

function handleChange() {
  emits("change", innerValue.value);
}

function togglePasswordVisible() {
  passwordVisible.value = !passwordVisible.value;
}

watch(
  () => props.modelValue,
  (newValue) => {
    innerValue.value = newValue;
    formItem?.validate("change").catch((err) => debugWarn(err));
  }
);

defineExpose<InputInstance>({
  ref: _ref,
  focus,
  blur,
  select,
  clear,
});
</script>

<template>
  <div
    class="er-input"
    :class="{
      [`er-input--${type}`]: type,
      [`er-input--${size}`]: size,
      'is-disabled': isDisabled,
      'is-prepend': $slots.prepend,
      'is-append': $slots.append,
      'is-prefix': $slots.prefix,
      'is-suffix': $slots.suffix,
      'is-focus': isFocused,
    }"
  >
    <!-- input -->
    <template v-if="type !== 'textarea'">
      <!-- prepend slot -->
      <div v-if="$slots.prepend" class="er-input__prepend">
        <slot name="prepend"></slot>
      </div>
      <div class="er-input__wrapper" ref="wrapperRef">
        <!-- prefix slot -->
        <span v-if="$slots.prefix" class="er-input__prefix">
          <slot name="prefix"></slot>
        </span>
        <input
          class="er-input__inner"
          ref="inputRef"
          :id="inputId"
          :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
          :disabled="isDisabled"
          :readonly="readonly"
          :autocomplete="autocomplete"
          :placeholder="placeholder"
          :autofocus="autofocus"
          :form="form"
          v-model="innerValue"
          v-bind="attrs"
          @input="handleInput"
          @change="handleChange"
          @focus="handleFocus"
          @blur="handleBlur"
        />
        <!-- suffix slot -->
        <span
          v-if="$slots.suffix || showClear || showPasswordArea"
          class="er-input__suffix"
        >
          <slot name="suffix"></slot>
          <Icon
            icon="circle-xmark"
            v-if="showClear"
            class="er-input__clear"
            @click="clear"
            @mousedown.prevent="noop"
          />
          <Icon
            icon="eye"
            v-if="showPasswordArea && passwordVisible"
            class="er-input__password"
            @click="togglePasswordVisible"
          />
          <Icon
            icon="eye-slash"
            v-if="showPasswordArea && !passwordVisible"
            class="er-input__password"
            @click="togglePasswordVisible"
          />
        </span>
      </div>
      <!-- append slot -->
      <div v-if="$slots.append" class="er-input__append">
        <slot name="append"></slot>
      </div>
    </template>

    <!-- textarea -->
    <template v-else>
      <textarea
        class="er-textarea__wrapper"
        ref="textareaRef"
        :id="inputId"
        :disabled="isDisabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        :autofocus="autofocus"
        :form="form"
        v-model="innerValue"
        v-bind="attrs"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      ></textarea>
    </template>
  </div>
</template>

<style scoped>
@import "./style.css";
</style>
