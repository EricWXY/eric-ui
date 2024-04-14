<script setup>
import { ErMessage } from "eric-ui";
function handleBtnClick() {
  ErMessage.info("btn click");
}
</script>

<template>
  <p>
    <er-button @click="handleBtnClick"> with throttle</er-button>
    <er-button :use-throttle="false" @click="handleBtnClick"
      >without throttle</er-button
    >
  </p>
</template>
