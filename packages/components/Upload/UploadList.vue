<script setup lang="ts">
import type { UploadListProps } from "./types";
import ErIcon from "../Icon/Icon.vue";
defineOptions({
  name: "ErUploadList",
});

defineProps<UploadListProps>();

const statusIconMap = new Map([
  ["success", "check-circle"],
  ["error", "times-circle"],
  ["uploading", "spinner"],
]);
</script>

<template>
  <ul class="er-upload-list">
    <li v-for="item in fileList" :key="item.uid" class="er-upload-list__item">
      <span class="file-name" :class="{ [`file-name-${item.status}`]: true }">
        <er-icon icon="file-alt" />
        {{ item.name }}
      </span>
      <span
        class="file-status"
        :class="{ [`file-status-${item.status}`]: true }"
      >
        <er-icon
          :icon="statusIconMap.get(item.status || '') ?? ''"
          :spin="item.status === 'uploading'"
        />
      </span>
      <span class="file-action">
        <er-icon icon="times" @click="onRemove?.(item)" />
      </span>
    </li>
  </ul>
</template>

<style scoped>
.er-upload-list {
  margin: 0;
  padding: 0;
  list-style-type: none;
  .er-upload-list__item {
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
    font-size: 14px;
    line-height: 1.8;
    margin-top: 5px;
    box-sizing: border-box;
    border-radius: 4px;
    min-width: 200px;
    position: relative;
    &:first-child {
      margin-top: 10px;
    }
    .file-name {
      margin-left: 5px;
      margin-right: 40px;
      color: var(--er-text-color-regular);
      svg {
        margin-right: 5px;
        color: var(--er-text-color-regular);
      }
    }
    .file-name-error {
      color: var(--er-color-danger);
    }
    .file-status-success {
      color: var(--er-color-success);
    }
    .file-status-error {
      color: var(--er-color-danger);
    }
    .file-status {
      display: block;
      position: absolute;
      right: 5px;
      top: 0;
      line-height: inherit;
    }
    .file-action {
      display: none;
      position: absolute;
      right: 7px;
      top: 0;
      line-height: inherit;
      cursor: pointer;
    }
    &:hover {
      background-color: var(--er-fill-color-light);
      .file-status {
        display: none;
      }
      .file-action {
        display: block;
      }
    }
  }
}
</style>
