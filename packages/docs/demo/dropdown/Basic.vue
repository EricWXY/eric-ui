<script setup lang="ts">
import {
  ErDropdown,
  ErDropdownItem,
  ErIcon,
  type DropdownItemProps
} from 'eric-ui'

const items: DropdownItemProps[] = [
  { command: '1', label: 'Action 1' },
  { command: '2', label: 'Action 2' },
  { command: '3', label: 'Action 3', disabled: true },
  { command: '4', label: 'Action 4', divided: true }
]
</script>

<template>
  <h2>通过 slot 传入 item</h2>
  <er-dropdown>
    <span class="dropdown-link">
      Dropdown List
      <er-icon icon="angle-down" />
    </span>
    <template #dropdown>
      <er-dropdown-item command="1">Action 1</er-dropdown-item>
      <er-dropdown-item command="2">Action 2</er-dropdown-item>
      <er-dropdown-item command="3" disabled>Action 3</er-dropdown-item>
      <er-dropdown-item command="4" divided>Action 4</er-dropdown-item>
    </template>
  </er-dropdown>
  <h2>通过 props 传入 item</h2>
  <er-dropdown :items="items">
    <span class="dropdown-link">
      Dropdown List
      <er-icon icon="angle-down" />
    </span>
  </er-dropdown>
</template>

<style scoped>
.dropdown-link {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: var(--er-color-primary);
  i {
    margin-left: 8px;
  }
}
</style>
