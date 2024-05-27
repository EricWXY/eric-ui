<script lang="ts" setup>
import { ErMessage } from "eric-ui";

const open1 = () => {
  ErMessage({
    message: "Congrats, this is a success message.",
    type: "success",
  });
};
const open2 = () => {
  ErMessage.success("Congrats, this is a success message.");
};
</script>
<template>
  <div>
    <er-button @click="open1">插件式调用</er-button>
    <er-button @click="open2">函数式调用</er-button>
    <er-button @click="$message.success('Congrats, this is a success message.')"
      >全局方法调用</er-button
    >
  </div>
</template>
