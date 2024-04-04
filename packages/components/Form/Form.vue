<script setup lang="ts">
import { provide } from 'vue'
import type {
  FormProps,
  FormItemContext,
  FormContext,
  FormValidateFailuer,
  FormInstance
} from './types'
import type { ValidateFieldsError } from 'async-validator'
import { FORM_CTX_KEY } from './constants'
import { size } from 'lodash-es'

defineOptions({ name: 'ErForm' })
const props = defineProps<FormProps>()
const fields: FormItemContext[] = []

const addField: FormContext['addField'] = function (field) {
  if (!field.prop) return
  fields.push(field)
}

const removeField: FormContext['removeField'] = function (field) {
  if (!field.prop) return
  fields.splice(fields.indexOf(field), 1)
}

async function validate() {
  let validationErrors: ValidateFieldsError = {}

  for (const field of fields) {
    try {
      await field.validate('')
    } catch (e) {
      const err = e as FormValidateFailuer
      validationErrors = {
        ...validationErrors,
        ...err.fields
      }
    }
  }
  if (!size(Object.keys(validationErrors))) return true
  return Promise.reject(validationErrors)
}

provide(FORM_CTX_KEY, { ...props, addField, removeField })

defineExpose<FormInstance>({
  validate
})
</script>

<template>
  <form class="er-form">
    <slot></slot>
  </form>
</template>
