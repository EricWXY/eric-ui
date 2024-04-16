<script lang="ts" setup>
import { reactive } from "vue";
import { ErMessage } from "eric-ui";

const form = reactive({
  name: "",
  region: "",
  delivery: false,
  desc: "",
});

const onSubmit = () => {
  ErMessage.success("submit!");
};
</script>

<template>
  <er-form :model="form">
    <er-form-item label="Activity name">
      <er-input v-model="form.name" />
    </er-form-item>
    <er-form-item label="Activity zone">
      <er-select v-model="form.region" placeholder="please select your zone">
        <er-option label="Zone one" value="shanghai" />
        <er-option label="Zone two" value="beijing" />
      </er-select>
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
