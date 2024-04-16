<script lang="ts" setup>
import { ErNotification } from "eric-ui";

const open1 = () => {
  ErNotification({
    title: "Success",
    message: "This is a success message",
    type: "success",
  });
};

const open2 = () => {
  ErNotification({
    title: "Warning",
    message: "This is a warning message",
    type: "warning",
  });
};

const open3 = () => {
  ErNotification({
    title: "Info",
    message: "This is an info message",
    type: "info",
  });
};

const open4 = () => {
  ErNotification({
    title: "Error",
    message: "This is an error message",
    type: "danger",
  });
};
</script>

<template>
  <er-button plain @click="open1"> Success </er-button>
  <er-button plain @click="open2"> Warning </er-button>
  <er-button plain @click="open3"> Info </er-button>
  <er-button plain @click="open4"> Error </er-button>
</template>
