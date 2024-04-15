<script setup lang="ts">
import { ErMessageBox, ErMessage } from "eric-ui";

function openConfirm() {
  ErMessageBox.prompt("Place input your name", "Tip", { type: "info" })
    .then(({ value }) => {
      ErMessage.info(`your name is: ${value}`);
    })
    .catch((action) => {
      ErMessage.warning(`action: ${action}`);
    });
}
</script>

<template>
  <er-button @click="openConfirm" plain> Click to open the Confirm</er-button>
</template>
