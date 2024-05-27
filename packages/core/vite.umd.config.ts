import { defineConfig } from "vite";
import { resolve } from "path";
import shell from "shelljs";

import vue from "@vitejs/plugin-vue";
import compression from "vite-plugin-compression";
import terser from "@rollup/plugin-terser";
import { delay } from "lodash-es";

const isProd = process.env.NODE_ENV === "production";
const isDev = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV === "test";

const BUILD_END_DELAY = 8000 as const;

export default defineConfig({
  plugins: [
    vue(),
    compression({
      filter: /.(cjs|css)$/i,
    }),
  ],
  build: {
    outDir: "dist/umd",
    lib: {
      entry: resolve(__dirname, "./index.ts"),
      name: "EricUI",
      fileName: "index",
      formats: ["umd"],
    },
    rollupOptions: {
      plugins: [
        terser({
          compress: {
            drop_console: isProd,
            drop_debugger: isProd,
            global_defs: {
              "@DEV": JSON.stringify(isDev),
              "@PROD": JSON.stringify(isProd),
              "@TEST": JSON.stringify(isTest),
            },
          },
        }),
        {
          name: "custromPlugin",
          buildStart() {
            isProd && shell.rm("-rf", "./dist");
          },
          buildEnd(__, err?: Error) {
            if (err) return;
            delay(() => {
              shell.cp("./dist/umd/index.css", "./dist/index.css");
              shell.cp("./dist/umd/index.css.gz", "./dist/index.css.gz");
            }, BUILD_END_DELAY);
          },
        },
      ],
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
