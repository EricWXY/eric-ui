import { defineConfig } from "vite";
import { resolve } from "path";
import { readdirSync } from "fs";
import { delay, filter, map } from "lodash-es";
import shell from "shelljs";

import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import compression from "vite-plugin-compression";
import terser from "@rollup/plugin-terser";

const isProd = process.env.NODE_ENV === "production";
const isDev = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV === "test";

const BUILD_END_DELAY = 2000 as const;

function getDirectoriesSync(basePath: string) {
  const entries = readdirSync(basePath, { withFileTypes: true });

  return map(
    filter(entries, (entry) => entry.isDirectory()),
    (entry) => entry.name
  );
}

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: "../../tsconfig.build.json",
      outDir: "dist/types",
    }),
    compression({
      threshold: 1024 * 50,
    }),
  ],
  build: {
    outDir: "dist/es",
    cssCodeSplit: true,
    sourcemap: !isProd,

    lib: {
      entry: resolve(__dirname, "./index.ts"),
      name: "EricUI",
      fileName: "index",
      formats: ["es"],
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
          name: "customPlugin",
          buildEnd(__, err?: Error) {
            if (err) return;
            delay(() => {
              shell.mv("./dist/es/theme", "./dist");
            }, BUILD_END_DELAY);
          },
        },
      ],
      external: [
        "vue",
        "@fortawesome/fontawesome-svg-core",
        "@fortawesome/free-solid-svg-icons",
        "@fortawesome/vue-fontawesome",
        "@popperjs/core",
        "async-validator",
      ],
      output: {
        assetFileNames: (chunkInfo) => {
          if (chunkInfo.name === "style.css") {
            return "index.css";
          }
          if (
            chunkInfo.type === "asset" &&
            /\.(css)$/i.test(chunkInfo.name as string)
          ) {
            return "theme/[name].[ext]";
          }
          return chunkInfo.name as string;
        },
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
          if (id.includes("/packages/hooks")) {
            return "hooks";
          }
          if (id.includes("/packages/utils")) {
            return "utils";
          }
          for (const item of getDirectoriesSync("../components")) {
            if (id.includes(`/packages/components/${item}`)) {
              return item;
            }
          }
        },
      },
    },
  },
});
