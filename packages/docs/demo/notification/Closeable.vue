<script lang="ts" setup>
import {ErNotification} from 'eric-ui'

const open = () => {
  ErNotification.success({
    title: 'Info',
    message: 'This is a message without close button',
    showClose: false,
  })
}
</script>

<template>
  <er-button plain @click="open"> Hide close button </er-button>
</template>