<template>
  <div>
    <er-button type="primary" loading>Loading</er-button>
    <er-button type="primary" loading-icon="circle-notch" loading
      >Loading</er-button
    >
    <er-button type="primary" loading>
      <template #loading>
        <er-icon style="margin-right: 6px" icon="star" spin />
      </template>
      Loading
    </er-button>
  </div>
</template>
