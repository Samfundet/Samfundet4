export const KEY = {
  /**
   * Mapping of every existing translation key.
   *
   * referenced to as "KEY.example"
   *
   * Naming convention: <component/page/common>_<key>: '<component/page/common>.<key>'
   * This is because the right side strings MUST be unique
   */
  common_event: 'common.event',
  common_information: 'common.information',
  common_restaurant: 'common.restaurant',
  common_volunteer: 'common.volunteer',
  common_member: 'common.member',
  common_internal: 'common.internal',
  common_other_language: 'common.other_language',
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
};
