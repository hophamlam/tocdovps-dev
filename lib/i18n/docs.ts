import type { Locale } from "./config";
import { baseTranslations } from "./base";

const isDocsKey = (key: string) => key.startsWith("docs.");

export const docsTranslations: Record<Locale, Record<string, string>> = {
  vi: Object.fromEntries(
    Object.entries(baseTranslations.vi).filter(([k]) => isDocsKey(k))
  ),
  en: Object.fromEntries(
    Object.entries(baseTranslations.en).filter(([k]) => isDocsKey(k))
  ),
} as const;
