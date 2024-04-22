---
title: Loading
description: Loaidng 组件文档

next:
  link: components/message
  text: Message 消息提示

prev:
  link: components/alert
  text: Alert 提示
---

# Loading 加载

加载数据时显示动效。

## 基础用法

自定义指令 `v-loading`，只需要绑定 `boolean` 值即可。

::: preview
demo-preview=../demo/loading/Basic.vue
:::

## 自定义加载中组件内容

在绑定了 `v-loading` 指令的元素上添加 `element-loading-text` 属性，其值会被渲染为加载文案，并显示在加载图标的下方。 类似地， `element-loading-spinner`、`element-loading-background` 属性分别用来设定 加载图标、背景色值。

::: preview
demo-preview=../demo/loading/Custom.vue
:::

## 全屏加载

当使用指令方式时，全屏遮罩需要添加`fullscreen`修饰符（遮罩会插入至 body 上） 此时若需要锁定屏幕的滚动，可以使用`lock`修饰符； 当使用服务方式时，遮罩默认即为全屏，无需额外设置。

::: preview
demo-preview=../demo/loading/Fullscreen.vue
:::

## 服务方式调用

服务方式调用，可以自定义遮罩的文案，也可以通过 `close` 方法关闭。

```typescript
import { ErLoading } from "eric-ui";
```

需要的时候通过以下方式调用

```typescript
ErLoading.service(options);
```

LoadingService 会返回一个 Loading 实例，可通过调用该实例的 close 方法来关闭它

```typescript
const loading = ErLoading.service(options);
nextTick(() => {
  loading.close();
});
```

::: tip
以服务的方式调用的全屏 Loading 是单例的。 若在前一个全屏 Loading 关闭前再次调用全屏 Loading，并不会创建一个新的 Loading 实例，而是返回现有全屏 Loading 的实例
:::

## Loading API

### Options

| Name       | Description        | Type          | Default       |
| ---------- | ------------------ | ------------- | ------------- |
| target     | 遮罩绑定的目标元素 | `HTMLElement` | document.body |
| fullscreen | 是否为全屏遮罩     | `boolean`     | true          |
| lock       | 是否锁定屏幕滚动   | `boolean`     | false         |
| text       | 加载文案           | `string`      | --            |
| spinner    | 加载图标           | `string`      | --            |
| background | 遮罩背景色         | `string`      | --            |

### Directive

| Name                  | Description      | Type      |
| --------------------- | ---------------- | --------- |
| v-loading             | 是否显示加载动画 | `boolean` |
| er-loading-text       | 加载文案         | `string`  |
| er-loading-spinner    | 加载图标         | `string`  |
| er-loading-background | 遮罩背景色       | `string`  |
