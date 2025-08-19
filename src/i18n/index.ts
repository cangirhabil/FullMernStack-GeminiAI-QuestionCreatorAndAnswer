import { en } from "./locales/en";
import { tr } from "./locales/tr";
import { nl } from "./locales/nl";

export const dictionaries = { en, tr, nl } as const;
export type Locale = keyof typeof dictionaries;

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
