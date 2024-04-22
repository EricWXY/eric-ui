---
title: Notification
description: Notification 组件文档

next: 
  link: /components/popconfirm
  text: PopConfirm 气泡确认框

prev:
  link: /components/messagebox
  text: MessageBox 消息弹出框
---

# Notification 通知

悬浮出现在页面角落，显示全局的通知提醒消息。

## 基础用法

::: preview
demo-preview=../demo/notification/Basic.vue
:::

## 不同类型的通知

提供了四种不同类型的提醒框：`success`、`warning`、`info` 和 `error` (danger 效果和 error 相同)。

::: preview
demo-preview=../demo/notification/Type.vue
:::

## 隐藏关闭按钮

可以通过设置 `closable` 属性来隐藏关闭按钮。

::: preview
demo-preview=../demo/notification/Closeable.vue
:::

## 全局方法

通过全局方法 `$notify` 调用，可以弹出通知。

## 单独引用

```typescript
import { ErNotification } from "eric-ui";
```

## Notification API

### Options

| Name      | Description      | Type                                                     | Default |
| --------- | ---------------- | -------------------------------------------------------- | ------- |
| title     | 标题             | `string`                                                 | -       |
| message   | 通知正文内容     | `string \| VNode`                                        | -       |
| type      | 通知的类型       | `enum` - `info \| success \| warning \| error \| danger` | info    |
| icon      | 自定义图标       | `string`                                                 | -       |
| duration  | 显示时间         | `number`                                                 | 3000    |
| showClose | 是否显示关闭按钮 | `boolean`                                                | true    |
| onClose   | 关闭时的回调函数 | `() => void`                                             | -       |
| onClick   | 点击时的回调函数 | `() => void`                                             | -       |
| offset    | 偏移             | `number`                                                 | 20      |

### Handler

| Name  | Description       | Type         |
| ----- | ----------------- | ------------ |
| close | 关闭 Notification | `() => void` |
