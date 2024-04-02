<script setup lang="ts">
import { ref } from 'vue'
import { ErMessage } from 'eric-ui'

const openVal = ref(['a'])
const dropdownOptions = ref([
  {
    label: 'Option A',
    name: 'a'
  },
  {
    label: 'Option B',
    name: 'b'
  },
  {
    label: 'Option C',
    name: 'c'
  }
])
const switchValue = ref(true)
const inputValue = ref('')
const selectValue = ref('a')
const selectOptions = ref([
  {
    label: 'Option A',
    value: 'a'
  },
  {
    label: 'Option B',
    value: 'b'
  },
  {
    label: 'Option C',
    value: 'c'
  }
])

function handleBtnClick () {
  ErMessage.info('Button Click')
}
</script>

<template>
  <div>
    <p>
      <er-button @click="handleBtnClick">Default</er-button>
      <er-button type="primary">Primary</er-button>
      <er-button type="success">Success</er-button>
      <er-button type="info">Info</er-button>
      <er-button type="warning">Warning</er-button>
      <er-button type="danger">Danger</er-button>
    </p>
    <p>
      <er-button plain>Plain</er-button>
      <er-button type="primary" plain>Primary</er-button>
      <er-button type="success" plain>Success</er-button>
      <er-button type="info" plain>Info</er-button>
      <er-button type="warning" plain>Warning</er-button>
      <er-button type="danger" plain>Danger</er-button>
    </p>
    <p>
      <er-button round>Round</er-button>
      <er-button type="primary" round>Primary</er-button>
      <er-button type="success" round>Success</er-button>
      <er-button type="info" round>Info</er-button>
      <er-button type="warning" round>Warning</er-button>
      <er-button type="danger" round>Danger</er-button>
    </p>
    <p>
      <er-button icon="search" circle />
      <er-button type="primary" icon="edit" circle />
      <er-button type="success" icon="check" circle />
      <er-button type="info" icon="message" circle />
      <er-button type="warning" icon="star" circle />
      <er-button type="danger" icon="trash" circle />
    </p>
    <er-collapse v-model="openVal" accordion>
      <er-collapse-item name="a" title="Title a">
        <h1>headline title</h1>
        <div>this is content a</div>
      </er-collapse-item>
      <er-collapse-item name="b" title="title b">
        <div>this is content b</div>
      </er-collapse-item>
      <er-collapse-item name="c" title="title c  disable" disabled>
        <div>this is content c</div>
      </er-collapse-item>
    </er-collapse>
  </div>

  <er-dropdown :menu-options="dropdownOptions" trigger="click"
    >dropdown</er-dropdown
  >
  <er-tooltip
    ref="tooltipRef"
    trigger="click"
    placement="right-end"
    :popper-options="{ placement: 'right-end', strategy: 'fixed' }"
  >
    <er-button icon="arrow-up">tooltip</er-button>
    <template #content> 弹出部分 </template>
  </er-tooltip>
  <er-input v-model="inputValue" placeholder="请输入内容" />
  <er-switch
    v-model="switchValue"
    size="large"
    active-text="ON"
    inactive-text="OFF"
  />
  <er-select
    v-model="selectValue"
    placeholder="请选择"
    :options="selectOptions"
  />
</template>
