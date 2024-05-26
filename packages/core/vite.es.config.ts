import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { readdirSync } from "fs";
import { filter, map } from "lodash-es";
import dts from "vite-plugin-dts";
import compression from "vite-plugin-compression";

const isProd = process.env.NODE_ENV === "production";

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
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: isProd,
        drop_debugger: isProd,
        keep_classnames: true,
        keep_fnames: true,
        evaluate: true,
      },
    },
    lib: {
      entry: resolve(__dirname, "./index.ts"),
      name: "EricUI",
      fileName: "index",
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "vue",
        "@fortawesome/fontawesome-svg-core",
        "@fortawesome/free-solid-svg-icons",
        "@fortawesome/vue-fontawesome",
        "@popperjs/core",
        "async-validator",
      ],
      input:{
        '@eric-ui/components':'../components'
      },
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
