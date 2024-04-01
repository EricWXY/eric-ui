import type { App, Plugin } from "vue";

export function makeInstaller(components: Plugin[]) {
  const install = (app: App) => {
    components.forEach((c) => {
      app.use(c);
    });
  };

  return install;
}
