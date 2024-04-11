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
        text: "快速上手",
        items: [{ text: "开始使用", link: "/get-started" }],
      },
      {
        text: "组件列表",
        items: [
          { text: "Button", link: "components/button" },
          { text: "Alert", link: "components/alert" },
          { text: "Collapse", link: "components/collapse" },
          { text: "Dropdown", link: "components/dropdown" },
        ],
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
