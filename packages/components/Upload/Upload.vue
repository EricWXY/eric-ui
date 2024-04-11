<script setup lang="ts">
import type { UploadProps, UploadFile } from "./types";
import ErButton from "../Button/Button.vue";
import { ref } from "vue";
import { cloneDeep, each, isFunction } from "lodash-es";
import axios, { type AxiosProgressEvent } from "axios";
import { useId } from "@eric-ui/hooks";
import UploadList from "./UploadList.vue";

defineOptions({
  name: "ErUpload",
});

const props = defineProps<UploadProps>();

const fileInputRef = ref<HTMLInputElement>();
const fileList = ref<UploadFile[]>(props.defaultFileList ?? []);

function setFileListItem(item: UploadFile) {
  const index = fileList.value.findIndex((file) => file.uid === item.uid);
  if (index !== -1) {
    fileList.value.splice(index, 1, cloneDeep(item));
  } else {
    fileList.value.unshift(cloneDeep(item));
  }
}

function handleClick() {
  fileInputRef.value?.click();
}

function handleFileChange(e: Event) {
  const files = (e.target as HTMLInputElement)?.files;
  if (!files) return;
  uploadFiles(files);
  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
}

function uploadFiles(files: FileList) {
  const postFiles = Array.from(files);
  each(postFiles, (file) => {
    if (!props?.beforeUpload) {
      post(file);
    } else {
      const result = props.beforeUpload(file);
      if (result && result instanceof Promise) {
        result.then((processFile) => {
          post(processFile);
        });
      } else if (result !== false) {
        post(file);
      }
    }
  });
}

function post(file: File) {
  const _file: UploadFile = {
    uid: useId().value + "_upload-file_" + Date.now(),
    status: "ready",
    name: file.name,
    size: file.size,
    percent: 0,
    raw: file,
  };

  setFileListItem(_file);

  const formData = new FormData();
  formData.append(file.name, file);
  axios
    .postForm(props.action, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (e: AxiosProgressEvent) => {
        let percent = Math.round((e.loaded * 100) / e.total!) || 0;

        _file.percent = percent;
        if (percent < 100) {
          _file.status = "uploading";
          setFileListItem(_file);
        }
        isFunction(props.onProgress) && props.onProgress(percent, file);
      },
    })
    .then((resp: any) => {
      _file.status = "success";
      _file.response = resp.data;
      isFunction(props.onSuccess) && props.onSuccess(resp.data, file);
      setFileListItem(_file);
    })
    .catch((err) => {
      _file.status = "error";
      isFunction(props.onError) && props.onError(err, file);
      setFileListItem(_file);
    })
    .finally(() => {
      isFunction(props.onChange) && props.onChange(file);
    });
}

function handleRemove(file: UploadFile) {
  fileList.value = fileList.value.filter((item) => item.uid !== file.uid);
  isFunction(props.onRemove) && props.onRemove(file);
}
</script>

<template>
  <div class="er-upload">
    <div class="er-upload__content" @click="handleClick">
      <slot>
        <er-button type="primary">Upload File</er-button>
      </slot>
    </div>
    <input
      ref="fileInputRef"
      class="er-file-input"
      type="file"
      @change="handleFileChange"
      style="display: none"
    />
    <upload-list :file-list="fileList" :on-remove="handleRemove" />
  </div>
</template>
