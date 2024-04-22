---
title: Tooltip
description: Tooltip 组件文档

next:
  link: /components/form
  text: Form 表单

prev:
  link: /components/popconfirm
  text: Popconfirm 气泡确认框
---

# Tooltip 文字提示

文字提示，在鼠标 hover 时显示提示文字。

::: tip
todo: 目前只是做了简单封装，待完善(effect 部分)
:::

## 基础用法

::: preview
demo-preview=../demo/tooltip/Basic.vue
:::

## 更多内容的文字提示

展示多行文本或者设置内容的格式
通过 `content` 插槽设置内容

::: preview
demo-preview=../demo/tooltip/Slot.vue
:::

## 禁用状态

禁用状态，鼠标悬停无法触发文字提示。`disabled` 属性可以满足这个需求。

::: preview
demo-preview=../demo/tooltip/Disabled.vue
:::

## Tooltip API

### Props

| Name           | Description | Type                                                     | Default |
| -------------- | ----------- | -------------------------------------------------------- | ------- |
| content        | 提示文字    | `string`                                                 | -       |
| disabled       | 是否禁用    | `boolean`                                                | false   |
| placement      | 弹出位置    | `string`                                                 | bottom  |
| trigger        | 触发方式    | `string`                                                 | hover   |
| manual         | 手动控制    | `boolean`                                                | false   |
| popper-options | popper 配置 | `object` 参考[popper.js](https://popper.js.org/docs/v2/) | {}      |
| transition     | 动画        | `string`                                                 | fade    |
| show-timeout   | 显示延时    | `number`                                                 | 0       |
| hide-timeout   | 隐藏延时    | `number`                                                 | 200     |

### Events

| Name           | Description            | Type                         |
| -------------- | ---------------------- | ---------------------------- |
| visible-change | 显示隐藏状态改变时触发 | `(visible: boolean) => void` |
| click-outside  | 点击外部时触发         | `() => void`                 |

### Slots

| Name    | Description |
| ------- | ----------- |
| default | 默认插槽    |
| content | 内容插槽    |

### Expose

| Name | Description | Type         |
| ---- | ----------- | ------------ |
| show | 显示        | `() => void` |
| hide | 隐藏        | `() => void` |
