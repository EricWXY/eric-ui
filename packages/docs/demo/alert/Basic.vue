<template>
  <h2>通过 slot 传入内容</h2>
  <div style="max-width: 600px">
    <er-alert type="success">Success alert</er-alert>
    <er-alert type="info">Info alert</er-alert>
    <er-alert type="warning">Warning alert</er-alert>
    <er-alert type="danger">Error alert</er-alert>
  </div>
  <h2>通过 prop 传入内容</h2>
  <div style="max-width: 600px">
    <er-alert type="success" title="Success alert" />
    <er-alert type="info" title="Info alert" />
    <er-alert type="warning" title="Warning alert" />
    <er-alert type="danger" title="Error alert" />
  </div>
</template>
