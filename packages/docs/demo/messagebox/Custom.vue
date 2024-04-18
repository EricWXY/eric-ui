<script setup lang="ts">
import { h } from "vue";
import { ErMessage, ErMessageBox } from "eric-ui";
import { delay } from "lodash-es";

async function openMsgBox() {
  try {
    const action = await ErMessageBox({
      title: "Message",
      message: h("p", null, [
        h("span", null, "Message can be "),
        h("i", { style: "color: teal" }, "VNode"),
      ]),
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      type: "danger",
      icon: "trash",
      beforeClose(action, instance, done) {
        if (action !== "confirm") {
          done();
          return;
        }

        instance.confirmButtonLoading = true;
        instance.confirmButtonText = "Loading...";
        delay(() => {
          done();
          delay(() => (instance.confirmButtonLoading = false), 1000);
        }, 3000);
      },
    });

    ErMessage.info(`action : ${action}`);
  } catch (action) {
    ErMessage.warning(`action : ${action}`);
  }
}
</script>

<template>
  <er-button @click="openMsgBox" plain>Click to open Message Box</er-button>
</template>
