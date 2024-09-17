import type { KEY } from './constants';
import type { PLURAL } from './utils';

/**
 * Types used for type-proofing translations.
 * Reveals errors in translations.ts if some keys are not translated.
 */
export type TranslationKeys = keyof typeof KEY;

export type PluralKeys = keyof typeof PLURAL;
export type Plural = (typeof PLURAL)[PluralKeys];

/** Translation object for this project */
export type Translations = Record<TranslationKeys, string | Partial<Record<Plural, string>>>;

export type MirrorKeys<T extends PropertyKey> = {
  [K in T]: K;
};

/** Final obj to pass into i18n library.  */
export type i18nTranslations = Record<string, string>;

export const LANGUAGES = {
  NB: 'nb',
  EN: 'en',
} as const;
