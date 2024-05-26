import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import compression from "vite-plugin-compression";

const isProd = process.env.NODE_ENV === "production";
export default defineConfig({
  plugins: [
    vue(),
    compression({
      filter: /.(cjs|css)$/i
    }),
  ],
  build: {
    outDir: "dist/umd",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: isProd,
        drop_debugger: isProd,
        evaluate: true,
      },
    },
    lib: {
      entry: resolve(__dirname, "./index.ts"),
      name: "EricUI",
      fileName: "index",
      formats: ["umd"],
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        exports: "named",
        globals: {
          vue: "Vue",
        },
        assetFileNames: (chunkInfo) => {
          if (chunkInfo.name === "style.css") {
            return "index.css";
          }
          return chunkInfo.name as string;
        },
      },
    },
  },
});
