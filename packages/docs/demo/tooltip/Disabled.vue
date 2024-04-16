<script lang="ts" setup>
import { ref } from "vue";

const disabled = ref(false);
</script>

<template>
  <er-tooltip
    :disabled="disabled"
    content="click to close tooltip function"
    placement="bottom"
  >
    <er-button @click="disabled = !disabled"
      >click to {{ disabled ? "active" : "close" }} tooltip function</er-button
    >
  </er-tooltip>
</template>
