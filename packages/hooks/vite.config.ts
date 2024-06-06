import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import { last, split, first } from "lodash-es";
import { hooksPlugin as hooks } from "@eric-ui/vite-plugins";

export default defineConfig({
  plugins: [
    dts({
      include: ["./**/*.ts"],
      exclude: ["./vite.config.ts"],
      rollupTypes: true,
    }),
    hooks({
      rmFiles: ["./dist"],
    }),
  ],
  build: {
    minify: false,
    lib: {
      entry: resolve(__dirname, "./index.ts"),
      name: "hooks",
      fileName: "index",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["vue", "lodash-es"],
      output: {
        manualChunks(id) {
          if (id.includes("/packages/hooks/src")) {
            return first(split(last(split(id, "/")), "."));
          }
        },
      },
    },
  },
});
