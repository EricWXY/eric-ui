---
title: MessageBox
description: MessageBox 组件文档

next: 
  link: /components/notification
  text: Notification 通知

prev:
  link: /components/message
  text: Message 消息提示
---

# MessageBox 消息弹框

模拟系统的消息提示框而实现的一套模态对话框组件，用于消息提示、确认消息和提交内容。

::: tip
从设计上来说，MessageBox 的作用是美化系统自带的 alert、confirm 和 prompt，因此适合展示较为简单的内容。
:::

## 消息提示

调用 `ErMessageBox.alert` 方法以打开 alert 框。

::: preview
demo-preview=../demo/messagebox/Alert.vue
:::

## 确认消息

调用 `ErMessageBox.confirm` 方法以打开 confirm 框。

::: preview
demo-preview=../demo/messagebox/Confirm.vue
:::

## 提交内容

调用 `ErMessageBox.prompt` 方法以打开 prompt 框。

::: preview
demo-preview=../demo/messagebox/Prompt.vue
:::

## 使用 VNode

`message` 可以是 VNode。

::: preview
demo-preview=../demo/messagebox/VNode.vue
:::

## 个性化

可以通过配置 `ErMessageBox` 的参数来实现一些个性化需求（options 参数见下文）。

::: preview
demo-preview=../demo/messagebox/Custom.vue
:::

## 内容居中

消息弹框支持使用居中布局。

`center` 参数为 `true` 时，消息弹框内容会居中。

::: preview
demo-preview=../demo/messagebox/Center.vue
:::

## 全局方法

`ErMessageBox` 提供了全局方法 `ErMessageBox.alert`、`ErMessageBox.confirm`、`ErMessageBox.prompt`，用于在需要时弹出消息弹框。
如果完整引入了 `EricUI`, 则会为 `app.config.globalProperties` 添加全局方法 `$msgbox`、`$alert`、`$confirm`、`$prompt`。
在 Vue 实例中可以作为 `this.$msgbox`、`this.$alert`、`this.$confirm`、`this.$prompt` 使用。

## 单独引用

```typescript
import { ErMessageBox } from "eric-ui";
```

## MessageBox API

### Options

| Name                    | Description                                | Type                                                                          | Default        |
| ----------------------- | ------------------------------------------ | ----------------------------------------------------------------------------- | -------------- |
| title                   | MessageBox 标题                            | `string`                                                                      | --             |
| message                 | MessageBox 消息正文内容                    | `string \| VNode \| () => VNode`                                              | --             |
| type                    | MessageBox 类型,用于图标展示               | `enum` - `'success' \| 'warning' \| 'info' \| 'error' \|'danger'`             | --             |
| icon                    | MessageBox 图标                            | `string`                                                                      | --             |
| callback                | MessageBox 关闭回调函数                    | `(action: MessageBoxAction) => void`                                          | --             |
| show-close              | 是否显示关闭按钮                           | `boolean`                                                                     | true           |
| before-close            | 关闭前的回调函数，会暂停 MessageBox 的关闭 | `(action: MessageBoxAction,instance:MessageBoxOptions,done:()=>void) => void` | --             |
| show-confirm-button     | 是否显示确认按钮                           | `boolean`                                                                     | true           |
| show-cancel-button      | 是否显示取消按钮                           | `boolean`                                                                     | false          |
| confirm-button-text     | 确认按钮的文字                             | `string`                                                                      | OK             |
| cancel-button-text      | 取消按钮的文字                             | `string`                                                                      | Cancel         |
| confirm-button-type     | 确认按钮的类型                             | `string`                                                                      | primary        |
| cancel-button-type      | 取消按钮的类型                             | `string`                                                                      | --             |
| confirm-button-disabled | 是否禁用确认按钮                           | `boolean`                                                                     | false          |
| confirm-button-loading  | 是否显示确认按钮的加载状态                 | `boolean`                                                                     | false          |
| cancel-button-disabled  | 是否禁用取消按钮                           | `boolean`                                                                     | false          |
| cancel-button-loading   | 是否显示取消按钮的加载状态                 | `boolean`                                                                     | false          |
| close-on-click-modal    | 点击遮罩是否允许关闭                       | `boolean`                                                                     | true           |
| show-input              | 是否显示输入框                             | `boolean`                                                                     | false          |
| input-placeholder       | 输入框的提示文字                           | `string`                                                                      | Place input... |
| input-type              | 输入框的类型                               | `string`                                                                      | text           |
| input-value             | 输入框的初始值                             | `string`                                                                      | ''             |
| center                  | 是否居中显示                               | `boolean`                                                                     | false          |
| round-button            | 是否显示圆角按钮                           | `boolean`                                                                     | false          |
| button-size             | 按钮大小，可选值为 default、large 、small  | `string`                                                                      | default        |
