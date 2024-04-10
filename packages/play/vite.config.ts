import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server:{
    proxy:{
      '/posts':{
        target:'https://jsonplaceholder.typicode.com',
        changeOrigin:true,
        // rewrite:path=>path.replace(/^\/posts/,'')
      }
    }
  }
})
