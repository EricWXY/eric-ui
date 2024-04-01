
import DefaultTheme from 'vitepress/theme'
import { type App } from 'vue'
import { ElementPlusContainer } from '@vitepress-demo-preview/component'
// import { library } from '@fortawesome/fontawesome-svg-core'
// import { fas } from '@fortawesome/free-solid-svg-icons'

import '@vitepress-demo-preview/component/dist/style.css'
// import '@/styles/index.css'
import './custom.css'

// library.add(fas)

export default {
  ...DefaultTheme,
  enhanceApp ({ app }: { app: App }) {
    app.component('demo-preview', ElementPlusContainer)
  }
}
