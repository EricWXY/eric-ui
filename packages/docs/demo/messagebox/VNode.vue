<script setup lang="ts">
import { h, ref } from "vue";
import { ErMessageBox, ErSwitch, type SwitchValueType } from "eric-ui";

function open1() {
  ErMessageBox({
    title: "Message",
    message: h("p", null, [
      h("span", null, "Message can be "),
      h("i", { style: "color: teal" }, "VNode"),
    ]),
  });
}

function open2() {
  const checked = ref<SwitchValueType>(false);
  ErMessageBox({
    title: "Message",
    message: () =>
      h(ErSwitch, {
        modelValue: checked.value,
        "onUpdate:modelValue": (val: SwitchValueType) => {
          checked.value = val;
        },
      }),
  });
}
</script>

<template>
  <er-button @click="open1" plain>Common VNode</er-button>
  <er-button @click="open2" plain>Dynamic props</er-button>
</template>
