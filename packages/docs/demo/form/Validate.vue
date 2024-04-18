<script lang="ts" setup>
import { reactive, ref } from "vue";
import { ErMessage, type FormInstance } from "eric-ui";

const formRef = ref<FormInstance>();
const form = reactive({
  name: "",
  region: "",
  delivery: false,
  desc: "",
});

const options = ref([
  { value: "beijing", label: "Zone One" },
  { value: "shanghai", label: "Zone Two" },
]);

const rules = reactive({
  name: [
    { required: true, message: "请输入活动名称", trigger: "blur" },
    { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
  ],
  region: [{ required: true, message: "请选择活动区域", trigger: "change" }],
  desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }],
});

const onSubmit = () => {
  formRef.value?.validate().then((valid) => {
    if (valid) {
      ErMessage.success("submit!");
    }
  });
};

const onReset = () => {
  formRef.value?.resetFields();
};
</script>

<template>
  <er-form ref="formRef" :model="form" :rules="rules">
    <er-form-item label="Activity name" prop="name">
      <er-input v-model="form.name" />
    </er-form-item>
    <er-form-item label="Activity zone" prop="region">
      <er-select
        v-model="form.region"
        placeholder="please select your zone"
        :options="options"
      />
    </er-form-item>
    <er-form-item label="Instant delivery" prop="delivery">
      <er-switch v-model="form.delivery" />
    </er-form-item>
    <er-form-item label="Activity form" prop="desc">
      <er-input v-model="form.desc" type="textarea" />
    </er-form-item>
    <er-form-item>
      <er-button type="primary" @click="onSubmit">Create</er-button>
      <er-button @click="onReset">Reset</er-button>
    </er-form-item>
  </er-form>
</template>
