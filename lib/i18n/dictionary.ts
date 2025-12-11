import type { Locale } from "./config";
import { docsTranslations } from "./docs";
import { uiTranslations } from "./ui";

export const translations = {
  vi: { ...uiTranslations.vi, ...docsTranslations.vi },
  en: { ...uiTranslations.en, ...docsTranslations.en },
} as const satisfies Record<Locale, Record<string, string>>;

export type TranslationKeys = keyof (typeof translations)[Locale];

export function getTranslation(locale: Locale, key: TranslationKeys): string {
  return translations[locale][key] ?? translations.vi[key] ?? key;
}
