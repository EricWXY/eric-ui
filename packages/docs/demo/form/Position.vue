<script lang="ts" setup>
import { reactive, ref } from "vue";
import { ErMessage, type FormProps } from "eric-ui";

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
const labelPosition = ref<FormProps["labelPosition"]>("right");

const onSubmit = () => {
  ErMessage.success("submit");
};
</script>

<template>
  <er-button-group size="small">
    <er-button
      @click="labelPosition = 'left'"
      :type="labelPosition === 'left' ? 'primary' : 'info'"
      >Left</er-button
    >
    <er-button
      @click="labelPosition = 'right'"
      :type="labelPosition === 'right' ? 'primary' : 'info'"
      >Right</er-button
    >
    <er-button
      @click="labelPosition = 'top'"
      :type="labelPosition === 'top' ? 'primary' : 'info'"
      >Top</er-button
    >
  </er-button-group>
  <div style="margin: 20px"></div>
  <er-form :model="form" :label-position="labelPosition">
    <er-form-item label="Activity name">
      <er-input v-model="form.name" />
    </er-form-item>
    <er-form-item label="Activity zone">
      <er-select
        v-model="form.region"
        placeholder="please select your zone"
        :options="options"
      />
    </er-form-item>
    <er-form-item label="Instant delivery">
      <er-switch v-model="form.delivery" />
    </er-form-item>
    <er-form-item label="Activity form">
      <er-input v-model="form.desc" type="textarea" />
    </er-form-item>
    <er-form-item>
      <er-button type="primary" @click="onSubmit">Create</er-button>
      <er-button>Cancel</er-button>
    </er-form-item>
  </er-form>
</template>
