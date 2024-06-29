import type { Language, TranslatePair } from "@eric-ui/locale";

export interface ConfigProviderProps {
  locale?: Language;
  extendsI18nMsg?: TranslatePair;
}
