<script setup lang="ts">
import { h } from "vue";
import { ErNotification } from "eric-ui";

function openNotify1() {
  ErNotification({
    title: "Title",
    message: h("i", { style: "color:teal" }, "This is a remider"),
    position:'bottom-right'
  });
}

function openNotify2() {
  ErNotification({
    title: "Prompt",
    message: "This is a message that does not auto close",
    duration: 0,
    position:'top-left'
  });
}
</script>

<template>
  <er-button @click="openNotify1" plain>Closes automatically</er-button>
  <er-button @click="openNotify2" plain>Won't closes automatically</er-button>
</template>
