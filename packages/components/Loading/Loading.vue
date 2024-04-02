<script setup lang="ts">
import { ref } from 'vue'
import type { LoadingOptions } from './types'
import ErIcon from '../Icon/Icon.vue'

defineOptions({ name: 'ErLoading' })
const props = defineProps<LoadingOptions>()
const afterLiveFlag = ref(false)

function close() {
  if (props.baforeClose && !props.baforeClose()) return
  afterLiveFlag.value = true
}

function handleAfterLive() {
  // live
  if (!afterLiveFlag.value) return

  afterLiveFlag.value = false
  props.onDestory?.()
}
</script>

<template>
  <Transition name="fade" @after-leave="handleAfterLive">
    <div class="er-loading" v-show="visible">
      <div class="er-loading__mask">
        <div class="er-loading__spinner">
          <er-icon icon=" spinner" size="1x" spin />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped></style>
