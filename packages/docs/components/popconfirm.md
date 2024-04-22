---
title: Popconfirm
description: Popconfirm 组件文档

prev: 
  link: /components/notification
  text: Notification 通知

next:
  link: /components/tooltip
  text: Tooltip 文字提示
---

# Popconfirm 气泡确认框

点击某个元素会弹出一个气泡式的确认框。

## 基础用法

::: preview
demo-preview=../demo/popconfirm/Basic.vue
:::

## 自定义弹出框内容

可以通过 props 来自定义 Popconfirm 中内容

::: preview
demo-preview=../demo/popconfirm/Custom.vue
:::

## 按钮回调

可以通过 `confirm` 和 `cancel` 两个事件的监听来获取点击按钮后的回调

::: preview
demo-preview=../demo/popconfirm/Callback.vue
:::

## Popconfirm API

### Props

| Name                | Description                  | Type      | Default         |
| ------------------- | ---------------------------- | --------- | --------------- |
| title               | 提示文字                     | `string`  | --              |
| confirm-button-text | 确认按钮文字                 | `string`  | Yes             |
| cancel-button-text  | 取消按钮文字                 | `string`  | No              |
| confirm-button-type | 确认按钮类型                 | `string`  | primary         |
| cancel-button-type  | 取消按钮类型                 | `string`  | --              |
| icon                | 图标                         | `string`  | question-circle |
| icon-color          | 图标颜色                     | `string`  | #f90            |
| hide-icon           | 隐藏图标                     | `boolean` | false           |
| hide-after          | 触发关闭的延时（单位：毫秒） | `number`  | 200             |
| width               | 宽度                         | `string`  | 150px           |

### Events

| Name    | Description        | Type                          |
| ------- | ------------------ | ----------------------------- |
| confirm | 点击确认按钮时触发 | `(event: MouseEvent) => void` |
| cancel  | 点击取消按钮时触发 | `(event: MouseEvent) => void` |

### Slots

| Name      | Description                                     |
| --------- | ----------------------------------------------- |
| default   | 默认插槽， 用于触发 Popconfirm 显示的 HTML 元素 |
| reference | 同上，（default 别名）                          |
