<script setup lang="ts">
import { provide } from 'vue'
import type {
  FormProps,
  FormEmit,
  FormItemContext,
  FormContext,
  FormInstance,
  FormValidateCallback
} from './types'
import type { ValidateFieldsError } from 'async-validator'
import { FORM_CTX_KEY } from './constants'
import { each, filter, includes, isFunction, size } from 'lodash-es'

defineOptions({ name: 'ErForm' })
const props = withDefaults(defineProps<FormProps>(), {
  showMessage: true,
  hideRequiredAsterisk: false,
  requiredAsteriskPosition: 'left',
  labelPosition: 'right',
})
const emit = defineEmits<FormEmit>()
const fields: FormItemContext[] = []

const addField: FormContext['addField'] = function (field) {
  if (!field.prop) return
  fields.push(field)
}

const removeField: FormContext['removeField'] = function (field) {
  if (!field.prop) return
  fields.splice(fields.indexOf(field), 1)
}

const validate: FormInstance['validate'] = async function (
  callback?: FormValidateCallback
) {
  return validateField([], callback)
}

const validateField: FormInstance['validateField'] = async function (
  keys: string[] = [],
  callback?: FormValidateCallback
) {
  const filterArr = size(keys)
    ? filter(fields, field => includes(keys, field.prop))
    : fields
  const hasCallback = isFunction(callback)

  try {
    const result = await doValidateField(filterArr)
    if (result === true) {
      callback?.(result)
    }
    return result
  } catch (e) {
    if (e instanceof Error) throw e
    const invalidFields = e as ValidateFieldsError

    callback?.(false, invalidFields)
    return hasCallback && Promise.reject(invalidFields)
  }
}

const resetFields: FormInstance['resetFields'] = function (
  keys: string[] = []
) {
  each(filterFields(fields, keys), field => field.resetField())
}

const clearValidate: FormInstance['clearValidate'] = function (
  keys: string[] = []
) {
  each(filterFields(fields, keys), field => field.clearValidate())
}

function filterFields(fields: FormItemContext[], props: string[]) {
  return size(props)
    ? filter(fields, field => includes(props, field.prop))
    : fields
}

async function doValidateField(fields: FormItemContext[] = []) {
  let validationErrors: ValidateFieldsError = {}

  for (const field of fields) {
    try {
      await field.validate('')
    } catch (e) {
      validationErrors = {
        ...validationErrors,
        ...(e as ValidateFieldsError)
      }
    }
  }
  if (!size(Object.keys(validationErrors))) return true
  return Promise.reject(validationErrors)
}

provide(FORM_CTX_KEY, {
  ...props,
  emit,
  addField,
  removeField
})

defineExpose<FormInstance>({
  validate,
  validateField,
  resetFields,
  clearValidate
})
</script>

<template>
  <form class="er-form">
    <slot></slot>
  </form>
</template>