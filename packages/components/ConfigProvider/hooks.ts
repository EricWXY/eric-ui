import {
  ref,
  getCurrentInstance,
  inject,
  computed,
  provide,
  unref,
} from "vue";
import type { MaybeRef, Ref, App } from "vue";
import {
  configProviderContextKey,
  type ConfigProviderContext,
} from "./constants";
import { createI18n, i18nSymbol } from "vue3-i18n";
import type { TranslatePair } from "@eric-ui/locale";
import English from "@eric-ui/locale/lang/en";
import { merge } from "lodash-es";
import { debugWarn } from "@eric-ui/utils";

const globalConfig = ref<ConfigProviderContext>();

export function useGlobalConfig<
  K extends keyof ConfigProviderContext,
  D extends ConfigProviderContext[K],
>(key: K, defaultVal?: D): Ref<Exclude<ConfigProviderContext[K], void>>;
export function useGlobalConfig(): Ref<ConfigProviderContext>;
export function useGlobalConfig(
  key?: keyof ConfigProviderContext,
  defaultVal = void 0
) {
  const config = getCurrentInstance()
    ? inject(configProviderContextKey, globalConfig)
    : globalConfig;

  return key ? computed(() => config.value?.[key] ?? defaultVal) : config;
}

const _createI18n = (opts?: ConfigProviderContext) => {
  const mergeMsg = (msg: TranslatePair) =>
    merge(msg, opts?.extendsI18nMsg ?? {});
  if (!opts?.locale)
    return createI18n({
      locale: "en",
      messages: mergeMsg({
        en: English.el,
      }),
    });

  return createI18n({
    locale: opts.locale?.name || "en",
    messages: mergeMsg({
      [opts.locale?.name || "en"]: opts.locale?.el || {},
    }),
  });
};

export function provideGlobalConfig(
  config: MaybeRef<ConfigProviderContext> = { locale: English },
  app?: App,
  global = false
) {
  const instance = getCurrentInstance();
  const oldConfig = instance ? useGlobalConfig() : void 0;
  const provideFn = app?.provide ?? (instance ? provide : void 0);

  if (!provideFn) {
    debugWarn(
      "provideGlobalConfig",
      "provideGlobalConfig() can only be used inside setup()"
    );
    return;
  }
  const context = computed(() => {
    const cfg = unref(config);
    if (!oldConfig?.value) return cfg;
    return merge(oldConfig.value, cfg);
  });
  const i18n = computed(() => {
    return _createI18n(context.value);
  });

  provideFn(configProviderContextKey, context);

  provideFn(i18nSymbol, i18n.value);

  if (app) app.use(i18n.value);

  if (global || !globalConfig.value) globalConfig.value = context.value;

  return context;
}
