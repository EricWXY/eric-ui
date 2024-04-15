<script setup lang="ts">
import { ErMessage, ErMessageBox } from "eric-ui";

function openMsgBox() {
  ErMessageBox.confirm(
    "proxy will permanently delete the file. Continue?",
    "Warning",
    {
      type: "warning",
      center: true,
      // 这里展示一下 不用 Promise 写法的时候
      callback(action) {
        if (action === "confirm") {
          ErMessage.info(action);
        } else {
          ErMessage.warning(action as string);
        }
      },
    }
  );
}
</script>

<template>
  <er-button @click="openMsgBox" plain>Click to open Message Box</er-button>
</template>
