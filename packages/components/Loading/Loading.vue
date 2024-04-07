<script setup lang="ts">
import type { LoadingOptions } from './types'
import ErIcon from '../Icon/Icon.vue'

defineOptions({ name: 'ErLoading' })
defineProps<LoadingOptions>()
</script>

<template>
  <Transition name="fade" @after-leave="onAfterLeave">
    <div v-show="visible" class="er-loading__mask">
      <div class="er-loading__spinner">
        <er-icon icon="circle-notch" spin />
      </div>
    </div>
  </Transition>
</template>

<style>
.er-loading__mask {
  position: absolute;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20000;
  margin: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transition: opacity var(--er-transition-duration);
  .er-loading__spinner {
    color: #409eff;
    font-size: 42px;
    width: 42px;
  }
}

.el-loading-parent--relative {
  position: relative !important;
}
</style>
