import { defineConfig } from 'vitepress'
import { fileURLToPath, URL } from 'node:url'
import { containerPreview, componentPreview } from '@vitepress-demo-preview/plugin'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Er-Element',
  description: '基于Vue3 高仿 element-ui 组件库',
  appearance: false, // 关闭 darkMode @todo 后续组件适配深色模式完成后打开
  // base: '/v-element/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '开始使用', link: '/get-started' },
      { text: '组件', link: '/components/button' }
    ],
    search: {
      provider: 'local'
    },
    sidebar: [
      {
        text: '组件列表',
        items: [{ text: 'Button', link: 'components/button' }]
      }
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }]
  },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('../..', import.meta.url)),
        'er-element': fileURLToPath(new URL('../../components', import.meta.url))
      }
    }
  },
  markdown: {
    config (md) {
      md.use(containerPreview)
      md.use(componentPreview)
    }
  }
})
