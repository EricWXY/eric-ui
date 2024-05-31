import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VueJSX from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VueJSX()],
  server: {
    proxy: {
      "/posts": {
        target: "https://jsonplaceholder.typicode.com",
        changeOrigin: true,
        // rewrite:path=>path.replace(/^\/posts/,'')
      },
    },
  },
});
