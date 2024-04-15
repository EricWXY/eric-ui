<script setup lang="ts">
import { ErMessageBox, ErMessage } from "eric-ui";

function openAlert() {
  ErMessageBox.alert("This is a message", "Title")
    .then((action) => {
      ErMessage.info(`action: ${action}`);
    })
    .catch((action) => {
      ErMessage.warning(`action: ${action}`);
    });
}
</script>

<template>
  <er-button @click="openAlert" plain> Click to open the Alert</er-button>
</template>
