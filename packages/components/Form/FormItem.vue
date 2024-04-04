<script setup lang="ts">
import {
  computed,
  provide,
  inject,
  reactive,
  onMounted,
  onUnmounted
} from 'vue'
import Schema from 'async-validator'
import { FormItemContext, FormItemProps, FormValidateFailuer } from './types'
import { isNil, get, size, filter } from 'lodash-es'
import { FORM_CTX_KEY, FORM_ITEM_CTX_KEY } from './constants'

defineOptions({ name: 'ErFormItem' })
const props = defineProps<FormItemProps>()
const ctx = inject(FORM_CTX_KEY)

const validateStatus = reactive({
  state: 'init',
  errMsg: '',
  loading: false
})
const getValByProp = (target: Record<string, any> | undefined) => {
  if (target && props.prop && !isNil(get(target, props.prop))) {
    return get(target, props.prop)
  }
  return null
}
const innerVal = computed(() => {
  const model = ctx?.model
  return getValByProp(model)
})
const itemRules = computed(() => {
  const rules = ctx?.rules
  return getValByProp(rules) ?? []
})

function getTriggeredRules(trigger?: string) {
  const rules = itemRules.value
  if (rules) {
    return filter(rules, rule => {
      if (!rule.trigger || !trigger) return true
      return rule.trigger && rule.trigger === trigger
    })
  }
  return []
}

function validate(trigger?: string) {
  const modelName = props.prop
  const triggeredRules = getTriggeredRules(trigger)

  if (!size(triggeredRules)) return true
  if (modelName) {
    const validator = new Schema({ [modelName]: triggeredRules })
    validateStatus.loading = true
    return validator
      .validate({
        [modelName]: innerVal.value
      })
      .then(() => {
        validateStatus.state = 'success'
        console.log('success')
      })
      .catch((err: FormValidateFailuer) => {
        const { errors } = err
        validateStatus.state = 'error'
        validateStatus.errMsg =
          errors && size(errors) > 0 ? errors[0].message ?? '' : ''
        console.log('error', err.errors)
        return Promise.reject(err)
      })
      .finally(() => {
        validateStatus.loading = false
      })
  }
}
const formItemCtx: FormItemContext = {
  validate,
  prop: props.prop || ''
}

onMounted(() => {
  if (props.prop) {
    ctx?.addField(formItemCtx)
  }
})

onUnmounted(() => {
  if (props.prop) {
    ctx?.removeField(formItemCtx)
  }
})

provide(FORM_ITEM_CTX_KEY, formItemCtx)
</script>

<template>
  <div
    class="er-form-item"
    :class="{
      'is-error': validateStatus.state === 'error',
      'is-success': validateStatus.state === 'success',
      'is-loading': validateStatus.loading
    }"
  >
    <label class="er-form-item__label">
      <slot name="label" :label="label">
        {{ label }}
      </slot>
    </label>
    <div class="er-form-item__content">
      <slot :validate="validate"></slot>
      <div
        class="er-form-item__error-msg"
        v-if="validateStatus.state === 'error'"
      >
        {{ validateStatus.errMsg }}
      </div>
    </div>
  </div>
</template>
