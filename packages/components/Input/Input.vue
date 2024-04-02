<script setup lang="ts">
import { computed, ref, watch, useAttrs, nextTick } from 'vue'
import type { InputProps, InputEmits } from './types'
import { each, noop } from 'lodash-es'
import Icon from '../Icon/Icon.vue'

defineOptions({
  name: 'ErInput',
  inheritAttrs: false
})
const props = withDefaults(defineProps<InputProps>(), { type: 'text', autocomplete: 'off' })
const emits = defineEmits<InputEmits>()
const attrs = useAttrs()

const innerValue = ref(props.modelValue)
const isFocus = ref(false)
const passwordVisible = ref(false)
const inputRef = ref<HTMLInputElement>()

const showClear = computed(
  () => props.clearable && !!innerValue.value && !props.disabled && isFocus.value
)

const showPasswordArea = computed(
  () => props.type === 'password' && props.showPassword && !props.disabled && !!innerValue.value
)

function handleInput() {
  emits('update:modelValue', innerValue.value)
  emits('input', innerValue.value)
}

function handleChange() {
  emits('change', innerValue.value)
}

function handleFocus(e: FocusEvent) {
  isFocus.value = true
  emits('focus', e)
}

function handleBlur(e: FocusEvent) {
  isFocus.value = false
  emits('blur', e)
}

function clear() {
  innerValue.value = ''
  each(['update:modelValue', 'input', 'change'], e => emits(e as any, ''))
  emits('clear')
}

async function keepFocus() {
  await nextTick()
  inputRef.value?.focus()
}

function togglePasswordVisible() {
  passwordVisible.value = !passwordVisible.value
}

watch(
  () => props.modelValue,
  newValue => {
    innerValue.value = newValue
  }
)

defineExpose({
  ref: inputRef,
  clear
})
</script>

<template>
  <div
    class="er-input"
    :class="{
      [`er-input--${type}`]: type,
      [`er-input--${size}`]: size,
      'is-disabled': disabled,
      'is-prepend': $slots.prepend,
      'is-append': $slots.append,
      'is-prefix': $slots.prefix,
      'is-suffix': $slots.suffix,
      'is-focus': isFocus
    }"
  >
    <!-- input -->
    <template v-if="type !== 'textarea'">
      <!-- prepend slot -->
      <div v-if="$slots.prepend" class="er-input__prepend">
        <slot name="prepend"></slot>
      </div>
      <div class="er-input__wrapper">
        <!-- prefix slot -->
        <span v-if="$slots.prefix" class="er-input__prefix">
          <slot name="prefix"></slot>
        </span>
        <input
          class="er-input__inner"
          ref="inputRef"
          :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
          :disabled="disabled"
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
          @click="keepFocus"
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
        ref="inputRef"
        :disabled="disabled"
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
@import './style.css';
</style>
