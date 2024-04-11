<script setup lang="ts">
import { type DropdownItemProps } from "./types";
import { DROPDOWN_CTX_KEY } from "./constants";
import { useId } from "@eric-ui/hooks";
import { inject } from "vue";

defineOptions({
  name: "ErDropdownItem",
});
const props = defineProps<DropdownItemProps>();

const ctx = inject(DROPDOWN_CTX_KEY);

function handleClick() {
  if (props.disabled) return;
  ctx?.handleItemClick(props);
}
</script>

<template>
  <li v-if="divided" role="separator" class="divided-placeholder"></li>
  <li
    :id="`dropdown-item-${command ?? useId().value}`"
    :class="{
      'er-dropdown__item': true,
      'is-disabled': disabled,
      'is-divided': divided,
    }"
    @click="handleClick"
  >
    <slot>
      {{ label }}
    </slot>
  </li>
</template>

<style scoped>
@import "./style.css";
</style>
