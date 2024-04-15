<script setup lang="ts">
import type { OverlayProps, OverlayEmits } from "./types";

defineOptions({ name: "ErOverlay" });
withDefaults(defineProps<OverlayProps>(), {
  mask: true,
});
const emits = defineEmits<OverlayEmits>();

function onMaskClick(e: MouseEvent) {
  emits("click", e);
}
</script>

<template>
  <div
    v-if="mask"
    class="er-overlay"
    :class="overlayClass"
    :style="{ zIndex: zIndex }"
    @click="onMaskClick"
  >
    <slot></slot>
  </div>
  <div
    v-else
    :class="overlayClass"
    :style="{
      zIndex: zIndex,
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }"
  >
    <slot></slot>
  </div>
</template>

<style scoped>
.er-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  overflow: auto;
  z-index: 2000;
}

</style>