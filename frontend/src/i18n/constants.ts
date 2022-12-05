/**
 * Mapping of every existing translation key.
 *
 * referenced to as "KEY.example"
 *
 * Naming convention: <component/page/common>_<key>: '<component/page/common>_<key>'
 * This is because the right side strings MUST be unique
 */
export const KEY = {
  common_event: 'common_event',
  common_information: 'common_information',
  common_restaurant: 'common_restaurant',
  common_volunteer: 'common_volunteer',
  common_member: 'common_member',
  common_internal: 'common_internal',
  common_other_language: 'common_other_language',
  common_buy: 'common_buy',
  common_login: 'common_login',
  common_logout: 'common_logout',
  common_password: 'common_password',
  login_forgotten_password: 'login_forgotten_password',
  login_internal_login: 'login_internal_login',
  login_email_placeholder: 'login_email_placeholder',
  gangs_title: 'gangs_title',
  gangs_text: 'gangs_text',
} as const;

/**
 * Types used for type-proofing translations
 * Reveals errors in translations.ts if some keys are not translated
 */
export type KeyKeys = keyof typeof KEY;
export type KeyValues = typeof KEY[KeyKeys];

export const LANGUAGES = {
  NB: 'nb',
  EN: 'en',
} as const;

export type LanguageKey = keyof typeof LANGUAGES;
export type LanguageValue = typeof LANGUAGES[LanguageKey];
