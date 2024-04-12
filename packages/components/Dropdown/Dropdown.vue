<script setup lang="ts">
import { ref, computed, provide, useSlots } from "vue";
import { omit, isNil, assign, map } from "lodash-es";
import type {
  DropdownProps,
  DropdownEmits,
  DropdownInstance,
  DropdownItemProps,
  DropdownContext,
} from "./types";
import { useId, useDisabledStyle } from "@eric-ui/hooks";
import { DROPDOWN_CTX_KEY } from "./constants";
import type { TooltipInstance } from "../Tooltip/types";
import type { ButtonInstance } from "../Button/types";

import ErButton from "../Button/Button.vue";
import ErButtonGroup from "../Button/ButtonGroup.vue";
import ErIcon from "../Icon/Icon.vue";
import DropdownItem from "./DropdownItem.vue";
import Tooltip from "../Tooltip/Tooltip.vue";

defineOptions({
  name: "ErDropdown",
  inheritAttrs: false,
});
const props = withDefaults(defineProps<DropdownProps>(), {
  hideOnClick: true,
  items: () => [] as DropdownItemProps[],
});
const emits = defineEmits<DropdownEmits>();
const slots = useSlots();

const tooltipRef = ref<TooltipInstance>();
const triggerRef = ref<ButtonInstance>();

const tooltipProps = computed(() =>
  omit(props, ["menuOptions", "hideAfterClick"])
);
const _items = computed(() =>
  map(props.items, (item) =>
    assign(item, { command: item.command ?? useId().value })
  )
);

function handleItemClick(e: DropdownItemProps) {
  if (e.disabled) return;
  props.hideOnClick && tooltipRef.value?.hide();
  !isNil(e.command) && emits("command", e.command);
}

useDisabledStyle(slots, props.disabled);

defineExpose<DropdownInstance>({
  open: () => tooltipRef.value?.show(),
  close: () => tooltipRef.value?.hide(),
});

provide<DropdownContext>(DROPDOWN_CTX_KEY, {
  handleItemClick,
});
</script>

<template>
  <div class="er-dropdown" :class="{ 'is-disabled': props.disabled }">
    <tooltip
      ref="tooltipRef"
      v-bind="tooltipProps"
      :virtual-ref="triggerRef"
      :virtual-triggering="splitButton"
      @visible-change="$emit('visible-change', $event)"
    >
      <er-button-group :disabled="disabled" v-if="splitButton">
        <er-button>
          <slot name="default"></slot>
        </er-button>
        <er-button ref="triggerRef">
          <er-icon icon="arrow-down" />
        </er-button>
      </er-button-group>
      <slot v-else name="default"></slot>

      <template #content>
        <ul class="er-dropdown__menu">
          <slot name="dropdown">
            <template v-for="item in _items" :key="item.command">
              <dropdown-item v-bind="item" />
            </template>
          </slot>
        </ul>
      </template>
    </tooltip>
  </div>
</template>

<style scoped>
@import "./style.css";
</style>
