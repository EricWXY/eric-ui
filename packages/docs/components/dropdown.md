---
title: Collapse
description: Collapse 组件文档
---

# Dropdown 下拉菜单

将动作或菜单折叠到下拉菜单中。

## 基础用法

通过组件 slot 来设置下拉触发的元素以及需要通过具名 slot 为 `dropdown` 来设置下拉菜单。

::: preview
demo-preview=../demo/dropdown/Basic.vue
:::

## 触发方式

通过设置 `trigger` 属性来改变触发方式。

::: tip
ps: 目前只实现了 click 和 hover 两种触发方式。
:::

::: preview
demo-preview=../demo/dropdown/Trigger.vue
:::

## 点击菜单隐藏

可以通过 `hide-on-click` 属性来配置。
下拉菜单默认在点击菜单项后会被隐藏，将 `hide-on-click` 属性设置为 false 可以关闭此功能。

::: preview
demo-preview=../demo/dropdown/HideOnClick.vue
:::

## 指令事件

点击菜单项后会触发事件，用户可以通过相应的菜单项 `command` 进行不同的操作。

::: preview
demo-preview=../demo/dropdown/Command.vue
:::

## 下拉方法

可以手动使用 `DropdownInstance.handleOpen` 或 `DropdownInstance.handleClose` 以打开或关闭下拉菜单

::: preview
demo-preview=../demo/dropdown/InstanceMethod.vue
:::
