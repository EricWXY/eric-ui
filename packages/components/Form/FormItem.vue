<script setup lang="ts">
import {
  computed,
  provide,
  inject,
  onMounted,
  onUnmounted,
  ref,
  nextTick,
  type Ref
} from 'vue'
import Schema from 'async-validator'
import type {
  FormItemContext,
  FormItemProps,
  FormValidateFailuer,
  FormValidateCallback,
  ValidateStatus,
  FormItemInstance,
  FromItemRule
} from './types'
import {
  isNil,
  get,
  size,
  filter,
  some,
  isFunction,
  isString,
  isNumber,
  endsWith,
  keys,
  includes,
  map,
  cloneDeep
} from 'lodash-es'
import { FORM_CTX_KEY, FORM_ITEM_CTX_KEY } from './constants'

defineOptions({ name: 'ErFormItem' })
const props = withDefaults(defineProps<FormItemProps>(), {
  showMessage: true
})
const ctx = inject(FORM_CTX_KEY)

const validateStatus: Ref<ValidateStatus> = ref('init')
const errMsg = ref('')
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
  const { required } = props

  const rules: FromItemRule[] = []
  if (props.rules) {
    rules.push(...props.rules)
  }

  const formRules = ctx?.rules
  if (formRules && props.prop) {
    const _rules = getValByProp(formRules)
    if (_rules) {
      rules.push(..._rules)
    }
  }

  if (!isNil(required)) {
    const requiredRules = filter(
      map(rules, (rule, i) => [rule, i]),
      (item: [FromItemRule, number]) => includes(keys(item[0]), 'required')
    )

    if (size(requiredRules)) {
      for (const item of requiredRules) {
        const [rule, i] = item as [FromItemRule, number]
        if (rule.required === required) continue
        rules[i] = { ...rule, required }
      }
    } else {
      rules.push({ required })
    }
  }

  return rules
})

const validateEnabled = computed(() => size(itemRules.value) > 0)
const isRequired = computed(
  () =>
    !ctx?.hideRequiredAsterisk &&
    (some(itemRules.value, 'required') || props?.required)
)
const isDisabled = computed(() => ctx?.disabled || props?.disabled)
const propString = computed(() => {
  if (!props.prop) return ''
  return isString(props.prop) ? props.prop : props.prop.join('.')
})

const normalizeLabelWidth = computed(() => {
  const _normalizeStyle = (val: number | string) => {
    if (isNumber(val)) return `${val}px`
    return endsWith(val, 'px') ? val : `${val}px`
  }

  if (props.labelWidth) return _normalizeStyle(props.labelWidth)
  if (ctx?.labelWidth) return _normalizeStyle(ctx.labelWidth)
  return '150px'
})

let initialVal: any = null
let isResetting = false

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

async function doValidate(rules: any[]) {
  const modelName = propString.value
  const validator = new Schema({ [modelName]: rules })
  return validator
    .validate({ [modelName]: initialVal.value }, { firstFields: true })
    .then(() => {
      validateStatus.value = 'success'
      ctx?.emit('validate', props, true, '')
      return true
    })
    .catch((err: FormValidateFailuer) => {
      const { errors } = err
      validateStatus.value = 'error'
      errMsg.value = errors && size(errors) > 0 ? errors[0].message ?? '' : ''
      ctx?.emit('validate', props, false, errMsg.value)
      return Promise.reject(err)
    })
}

async function validate(trigger: string, callback?: FormValidateCallback) {
  if (isResetting || !props.prop) return false

  if (!validateEnabled.value) {
    callback?.(false)
    return false
  }

  const rules = getTriggeredRules(trigger)
  if (!size(rules)) {
    callback?.(true)
    return true
  }

  validateStatus.value = 'validating'

  return doValidate(rules)
    .then(() => {
      callback?.(true)
      return true
    })
    .catch((err: FormValidateFailuer) => {
      const { fields } = err
      callback?.(false, fields)
      return isFunction(callback) ? false : Promise.reject(fields)
    })
}
function resetField() {
  const model = ctx?.model
  if (model && propString.value && !isNil(get(model, propString.value))) {
    isResetting = true
    model[propString.value] = cloneDeep(initialVal)
  }

  nextTick(() => clearValidate())
}

function clearValidate() {
  validateStatus.value = 'init'
  errMsg.value = ''
  isResetting = false
}
const formItemCtx: FormItemContext = {
  ...props,
  disabled: isDisabled.value,
  validate,
  resetField,
  clearValidate
}

onMounted(() => {
  if (props.prop) {
    ctx?.addField(formItemCtx)
    initialVal = innerVal.value
  }
})

onUnmounted(() => {
  if (props.prop) {
    ctx?.removeField(formItemCtx)
  }
})

provide(FORM_ITEM_CTX_KEY, formItemCtx)

defineExpose<FormItemInstance>({
  validateMessage: errMsg,
  validateStatus,
  validate,
  resetField,
  clearValidate
})
</script>

<template>
  <div
    class="er-form-item"
    :class="{
      'is-error': error || validateStatus === 'error',
      'is-disabled': isDisabled,
      'is-required': isRequired,
      'asterisk-left': ctx?.requiredAsteriskPosition === 'left',
      'asterisk-right': ctx?.requiredAsteriskPosition === 'right'
    }"
  >
    <label
      class="er-form-item__label"
      :class="`position-${ctx?.labelPosition ?? 'right'}`"
    >
      <slot name="label" :label="label">
        {{ label }}{{ ctx?.labelSuffix }}
      </slot>
    </label>
    <div class="er-form-item__content">
      <slot :validate="validate"></slot>
      <div class="er-form-item__error-msg" v-if="validateStatus === 'error'">
        <template v-if="ctx?.showMessage && showMessage">
          <slot name="error" :error="error ?? errMsg">{{
            error ?? errMsg
          }}</slot>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import './style.css';

.er-form-item__label {
  width: v-bind(normalizeLabelWidth);
}
</style>
