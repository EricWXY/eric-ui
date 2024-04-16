<script setup lang="ts">
import {
  type Ref,
  computed,
  provide,
  inject,
  onMounted,
  onUnmounted,
  ref,
  nextTick,
  watch,
  reactive,
  watchEffect,
  toRefs,
  useSlots,
} from "vue";
import Schema, { type RuleItem } from "async-validator";
import type {
  FormItemContext,
  FormItemProps,
  FormValidateFailuer,
  FormValidateCallback,
  ValidateStatus,
  FormItemInstance,
  FormItemRule,
} from "./types";
import {
  isNil,
  get,
  size,
  filter,
  some,
  isString,
  isNumber,
  endsWith,
  keys,
  includes,
  map,
  cloneDeep,
  isArray,
} from "lodash-es";
import { useId } from "@eric-ui/hooks";
import { FORM_CTX_KEY, FORM_ITEM_CTX_KEY } from "./constants";

defineOptions({ name: "ErFormItem" });
const props = withDefaults(defineProps<FormItemProps>(), {
  showMessage: true,
  required: void 0,
});
const slots = useSlots();
const ctx = inject(FORM_CTX_KEY);

const labelId = useId().value;

const validateStatus: Ref<ValidateStatus> = ref("init");
const errMsg = ref("");

const inputIds = ref<string[]>([]);

const getValByProp = (target: Record<string, any> | void) => {
  if (target && props.prop && !isNil(get(target, props.prop))) {
    return get(target, props.prop);
  }
  return null;
};

const hasLabel = computed(() => !!(props.label || slots.label));
const labelFor = computed(
  () => props.for || (inputIds.value.length ? inputIds.value[0] : "")
);

const currentLabel = computed(
  () => `${props.label ?? ""}${ctx?.labelSuffix ?? ""}`
);

const innerVal = computed(() => {
  const model = ctx?.model;
  return getValByProp(model);
});

const itemRules = computed(() => {
  const { required } = props;

  const rules: FormItemRule[] = [];
  if (props.rules) {
    rules.push(...props.rules);
  }

  const formRules = ctx?.rules;
  if (formRules && props.prop) {
    const _rules = getValByProp(formRules);
    if (_rules) {
      rules.push(..._rules);
    }
  }

  if (!isNil(required)) {
    const requiredRules = filter(
      map(rules, (rule, i) => [rule, i]),
      (item: [FormItemRule, number]) => includes(keys(item[0]), "required")
    );

    if (size(requiredRules)) {
      for (const item of requiredRules) {
        const [rule, i] = item as [FormItemRule, number];
        if (rule.required === required) continue;
        rules[i] = { ...rule, required };
      }
    } else {
      rules.push({ required });
    }
  }

  return rules;
});

const validateEnabled = computed(() => size(itemRules.value) > 0);
const isRequired = computed(
  () =>
    !ctx?.hideRequiredAsterisk &&
    (some(itemRules.value, "required") || props?.required)
);
const isDisabled = computed(() => ctx?.disabled || props?.disabled);
const propString = computed(() => {
  if (!props.prop) return "";
  return isString(props.prop) ? props.prop : props.prop.join(".");
});

const normalizeLabelWidth = computed(() => {
  const _normalizeStyle = (val: number | string) => {
    if (isNumber(val)) return `${val}px`;
    return endsWith(val, "px") ? val : `${val}px`;
  };

  if (props.labelWidth) return _normalizeStyle(props.labelWidth);
  if (ctx?.labelWidth) return _normalizeStyle(ctx.labelWidth);
  return "150px";
});

let initialVal: any = null;
let isResetting = false;

function getTriggeredRules(trigger?: string) {
  const rules = itemRules.value;
  if (rules) {
    return filter(rules, (r) => {
      if (!r.trigger || !trigger) return true;
      if (isArray(r.trigger)) {
        return r.trigger.includes(trigger);
      }
      return r.trigger === trigger;
    }).map(({ trigger, ...rule }) => rule as RuleItem);
  }
  return [];
}

async function doValidate(rules: any[]) {
  const modelName = propString.value;
  const validator = new Schema({ [modelName]: rules });
  return validator
    .validate({ [modelName]: innerVal.value }, { firstFields: true })
    .then(() => {
      validateStatus.value = "success";
      ctx?.emits("validate", props, true, "");
      return true;
    })
    .catch((err: FormValidateFailuer) => {
      const { errors } = err;
      validateStatus.value = "error";
      errMsg.value = errors && size(errors) > 0 ? errors[0].message ?? "" : "";
      ctx?.emits("validate", props, false, errMsg.value);
      return Promise.reject(err);
    });
}

const validate: FormItemInstance["validate"] = async function (
  trigger: string,
  callback?: FormValidateCallback
) {
  if (isResetting || !props.prop || isDisabled.value) return false;

  if (!validateEnabled.value) {
    callback?.(false);
    return false;
  }

  const rules = getTriggeredRules(trigger);
  if (!size(rules)) {
    callback?.(true);
    return true;
  }

  validateStatus.value = "validating";

  return doValidate(rules)
    .then(() => {
      callback?.(true);
      return true;
    })
    .catch((err: FormValidateFailuer) => {
      const { fields } = err;
      callback?.(false, fields);
      return Promise.reject(fields);
    });
};
const resetField: FormItemInstance["resetField"] = function () {
  const model = ctx?.model;
  if (model && propString.value && !isNil(get(model, propString.value))) {
    isResetting = true;
    model[propString.value] = cloneDeep(initialVal);
  }

  nextTick(() => clearValidate());
};

const clearValidate: FormItemInstance["clearValidate"] = function () {
  validateStatus.value = "init";
  errMsg.value = "";
  isResetting = false;
};

const addInputId: FormItemContext["addInputId"] = function (id) {
  if (!includes(inputIds.value, id)) inputIds.value.push(id);
};

const removeInputId: FormItemContext["removeInputId"] = function (id) {
  inputIds.value = filter(inputIds.value, (i) => i != id);
};

const formItemCtx: FormItemContext = reactive({
  ...toRefs(props),
  disabled: isDisabled.value,
  validate,
  resetField,
  clearValidate,
  addInputId,
  removeInputId,
});

onMounted(() => {
  if (props.prop) {
    ctx?.addField(formItemCtx);
    initialVal = innerVal.value;
  }
});

onUnmounted(() => {
  if (props.prop) {
    ctx?.removeField(formItemCtx);
  }
});

watchEffect(() => (formItemCtx.disabled = isDisabled.value));

watch(
  () => props.error,
  (val) => {
    errMsg.value = val || "";
    validateStatus.value = val ? "error" : "init";
  },
  { immediate: true }
);

provide<FormItemContext>(FORM_ITEM_CTX_KEY, formItemCtx);

defineExpose<FormItemInstance>({
  validateMessage: errMsg,
  validateStatus,
  validate,
  resetField,
  clearValidate,
});
</script>

<template>
  <div
    class="er-form-item"
    :class="{
      'is-error': validateStatus === 'error',
      'is-disabled': isDisabled,
      'is-required': isRequired,
      'asterisk-left': ctx?.requiredAsteriskPosition === 'left',
      'asterisk-right': ctx?.requiredAsteriskPosition === 'right',
    }"
  >
    <component
      v-if="hasLabel"
      class="er-form-item__label"
      :class="`position-${ctx?.labelPosition ?? 'right'}`"
      :is="labelFor ? 'label' : 'div'"
      :id="labelId"
      :for="labelFor"
    >
      <slot name="label" :label="currentLabel">
        {{ currentLabel }}
      </slot>
    </component>
    <div class="er-form-item__content">
      <slot :validate="validate"></slot>
      <div class="er-form-item__error-msg" v-if="validateStatus === 'error'">
        <template v-if="ctx?.showMessage && showMessage">
          <slot name="error" :error="errMsg">{{ errMsg }}</slot>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "./style.css";

.er-form-item {
  --er-form-label-width: v-bind(normalizeLabelWidth) !important;
}
</style>
