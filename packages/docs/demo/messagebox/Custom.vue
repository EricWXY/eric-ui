<script setup lang="ts">
import { h } from "vue";
import { ErMessage, ErMessageBox } from "eric-ui";

function openMsgBox() {
  ErMessageBox({
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
      if (action === "confirm") {
        instance.confirmButtonLoading = true;
        instance.confirmButtonText = "Loading...";
        setTimeout(() => {
          done();
          setTimeout(() => {
            instance.confirmButtonLoading = false;
          }, 1000);
        }, 3000);
      } else {
        done();
      }
    },
  })
    .then((action) => {
      ErMessage.info(`action : ${action}`);
    })
    .catch((action) => {
      ErMessage.warning(`action : ${action}`);
    });
}
</script>

<template>
  <er-button @click="openMsgBox" plain>Click to open Message Box</er-button>
</template>
