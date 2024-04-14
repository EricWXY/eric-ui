<script lang="ts" setup>
import { ErMessage } from "eric-ui";

const open1 = () => {
  ErMessage("This is a message.");
};
const open2 = () => {
  ErMessage({
    message: "Congrats, this is a success message.",
    type: "success",
  });
};
const open3 = () => {
  ErMessage({
    message: "Warning, this is a warning message.",
    type: "warning",
  });
};
const open4 = () => {
  ErMessage.error("Oops, this is a error message.");
};
</script>

<template>
  <er-button :plain="true" @click="open2">Success</er-button>
  <er-button :plain="true" @click="open3">Warning</er-button>
  <er-button :plain="true" @click="open1">Message</er-button>
  <er-button :plain="true" @click="open4">Error</er-button>
</template>
