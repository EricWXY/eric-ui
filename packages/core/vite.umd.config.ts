import { defineConfig } from "vite";
import { readFileSync } from "fs";
import { resolve } from "path";
import { delay } from "lodash-es";
import shell from "shelljs";

import vue from "@vitejs/plugin-vue";
import compression from "vite-plugin-compression";
import terser from "@rollup/plugin-terser";
import hooks from "./hooksPlugin";

const TRY_MOVE_STYLES_DELAY = 800 as const;

const isProd = process.env.NODE_ENV === "production";
const isDev = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV === "test";

function moveStyles() {
  try {
    readFileSync("./dist/umd/index.css.gz");

    shell.cp("./dist/umd/index.css", "./dist/index.css");
    shell.cp("./dist/umd/index.css.gz", "./dist/index.css.gz");
  } catch (_) {
    delay(moveStyles, TRY_MOVE_STYLES_DELAY);
  }
}

export default defineConfig({
  plugins: [
    vue(),
    compression({
      filter: /.(cjs|css)$/i,
    }),
    terser({
      compress: {
        drop_console: isProd && ["log"],
        drop_debugger: isProd,
        global_defs: {
          "@DEV": JSON.stringify(isDev),
          "@PROD": JSON.stringify(isProd),
          "@TEST": JSON.stringify(isTest),
        },
      },
    }),
    hooks({
      rmFiles: ["./dist/umd", "./dist/index.css", "./dist/index.css.gz"],
      afterBuild: moveStyles,
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
