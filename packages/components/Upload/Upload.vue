<script setup lang="ts">
import type { UploadProps } from './types'
import { ref } from 'vue'

defineOptions({
  name: 'ErUpload'
})

defineProps<UploadProps>()

const fileInputRef = ref<HTMLInputElement>()

function handleClick() {
  fileInputRef.value?.click()
}
</script>

<template>
  <div class="er-upload" @click="handleClick">
    <slot></slot>
    <input
      ref="fileInputRef"
      class="er-file-input"
      type="file"
      style="display: none"
    />
  </div>
</template>
