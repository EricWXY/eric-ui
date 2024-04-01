<script setup lang="ts">
import { ErButton } from 'eric-ui'
function handleClick(){
  alert('click')
}
</script>

<template>
  <er-button @click="handleClick">test btn</er-button>
  <er-button type="primary" @click="handleClick">Primary</er-button>
  <er-button type="success" @click="handleClick">Success</er-button>
  <er-button type="info" @click="handleClick">Info</er-button>
  <er-button type="warning" @click="handleClick">Warning</er-button>
  <er-button type="danger" @click="handleClick">Danger</er-button>
</template>
