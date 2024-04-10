<script setup lang="ts">
import type { UploadProps } from './types'
import ErButton from '../Button/Button.vue'
import { ref } from 'vue'
import { each, isFunction } from 'lodash-es'
import axios, { type AxiosProgressEvent } from 'axios'

defineOptions({
  name: 'ErUpload'
})

const props = defineProps<UploadProps>()

const fileInputRef = ref<HTMLInputElement>()

function handleClick() {
  fileInputRef.value?.click()
}

function handleFileChange(e: Event) {
  const files = (e.target as HTMLInputElement)?.files
  if (!files) return
  uploadFiles(files)
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

function uploadFiles(files: FileList) {
  const postFiles = Array.from(files)
  each(postFiles, file => {
    if (!props?.beforeUpload) {
      post(file)
    } else {
      const result = props.beforeUpload(file)
      if (result && result instanceof Promise) {
        result.then(processFile => {
          post(processFile)
        })
      } else if (result !== false) {
        post(file)
      }
    }
  })
}

function post(file: File) {
  const formData = new FormData()
  formData.append(file.name, file)
  axios
    .postForm(props.action, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (e: AxiosProgressEvent) => {
        let percent = Math.round((e.loaded * 100) / e.total!) || 0
        if (percent < 100) {
          isFunction(props.onProgress) && props.onProgress(percent, file)
        }
      }
    })
    .then((resp: any) => {
      isFunction(props.onSuccess) && props.onSuccess(resp.data, file)
    })
    .catch(err => {
      isFunction(props.onError) && props.onError(err, file)
    })
    .finally(() => {
      isFunction(props.onChange) && props.onChange(file)
    })
}
</script>

<template>
  <div class="er-upload" @click="handleClick">
    <slot>
      <er-button type="primary">Upload File</er-button>
    </slot>
    <input
      ref="fileInputRef"
      class="er-file-input"
      type="file"
      @change="handleFileChange"
      style="display: none"
    />
  </div>
</template>
