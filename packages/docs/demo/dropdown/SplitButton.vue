<script setup lang="ts">
import { type DropdownItemProps, ErMessage } from "eric-ui";

const items: DropdownItemProps[] = [
  { command: "1", label: "Action 1" },
  { command: "2", label: "Action 2" },
  { command: "3", label: "Action 3", disabled: true },
  { command: "4", label: "Action 4", divided: true },
];

function handleClick() {
  ErMessage.info("button click");
}
</script>

<template>
  <div class="row">
    <er-dropdown :items="items">
      <er-button type="primary">
        Dropdown List
        <er-icon icon="angle-down" style="margin-left: 8px" />
      </er-button>
    </er-dropdown>
    <er-dropdown
      :items="items"
      type="primary"
      @click="handleClick"
      split-button
    >
      Dropdown List
    </er-dropdown>
  </div>
</template>

<style scoped>
.row div {
  margin-right: 16px;
}
</style>
