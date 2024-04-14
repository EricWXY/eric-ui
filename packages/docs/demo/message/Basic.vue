<script lang="ts" setup>
import { h } from "vue";
import { ErMessage } from "eric-ui";

const open = () => {
  ErMessage("This is a message.");
};

const openVn = () => {
  ErMessage({
    message: h("p", { style: "line-height: 1; font-size: 14px" }, [
      h("span", null, "Message can be "),
      h("i", { style: "color: teal" }, "VNode"),
    ]),
  });
};
</script>

<template>
  <er-button :plain="true" @click="open">Show message</er-button>
  <er-button :plain="true" @click="openVn">VNode</er-button>
</template>
