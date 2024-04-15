<script setup lang="ts">
import { ErMessageBox, ErMessage } from "eric-ui";

function openConfirm() {
  ErMessageBox.confirm("proxy will permanently delete the file. Continue?", "Warning", { type: "warning" })
    .then((action) => {
      ErMessage.info(`action: ${action}`);
    })
    .catch((action) => {
      ErMessage.warning(`action: ${action}`);
    });
}
</script>

<template>
  <er-button @click="openConfirm" plain> Click to open the Confirm</er-button>
</template>
