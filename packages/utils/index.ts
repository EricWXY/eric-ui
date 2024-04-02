import type { App, Plugin, Ref } from "vue";
import { defineComponent } from "vue";
import { each } from "lodash-es";

export function makeInstaller(components: Plugin[]) {
  const install = (app: App) =>
    each(components, (c) => {
      app.use(c);
    });

  return install;
}

export const RenderVnode = defineComponent({
  props: {
    vNode: {
      type: [String, Object],
      required: true,
    },
  },
  setup(props) {
    return () => props.vNode;
  },
});

export type MaybeRef<T> = T | Ref<T>;

export * from "./install";
