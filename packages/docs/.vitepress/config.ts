import { defineConfig } from "vitepress";
import {
  containerPreview,
  componentPreview,
} from "@vitepress-demo-preview/plugin";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Eric-UI",
  description: "基于Vue3 高仿 element-ui 组件库",
  appearance: false, // 关闭 darkMode @todo 深色模式完成后打开
  base: "/eric-ui/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "开始使用", link: "/get-started" },
      { text: "组件", link: "/components/button" },
    ],
    search: {
      provider: "local",
    },
    sidebar: [
      {
        text: "指南",
        collapsed: false,
        items: [{ text: "快速开始", link: "/get-started" }],
      },
      {
        text: "基础组件",
        collapsed: false,
        items: [
          { text: "Button 按钮", link: "components/button" },
          { text: "Collapse 折叠面板", link: "components/collapse" },
          { text: "Dropdown 下拉菜单", link: "components/dropdown" },
        ],
      },
      {
        text: "反馈组件",
        collapsed: false,
        items: [
          { text: "Alert 提示", link: "components/alert" },
          { text: "Loading 加载", link: "components/loading" },
          { text: "Message 消息提示", link: "components/message" },
          { text: "MessageBox 消息弹出框", link: "components/messagebox" },
          { text: "Notification 通知", link: "components/notification" },
          { text: "Popconfirm 气泡确认框", link: "components/popconfirm" },
          { text: "Tooltip 文字提示", link: "components/tooltip" },
        ],
      },
      {
        text: "表单组件",
        collapsed: false,
        items: [{ text: "Form 表单", link: "components/form" }],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/EricWXY/eric-ui" },
    ],
  },
  markdown: {
    config(md) {
      md.use(containerPreview);
      md.use(componentPreview);
    },
  },
});
