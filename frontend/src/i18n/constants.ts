export const KEY = {
  /**
   * Mapping of every existing translation key.
   *
   * referenced to as "KEY.example"
   *
   * Naming convention: <component/page>_<key>: '<component/page>.<key>'
   * This is because the right side strings MUST be unique
   */
  navbar_event: 'navbar.event',
  navbar_information: 'navbar.information',
  navbar_restaurant: 'navbar.restaurant',
  navbar_volunteer: 'navbar.volunteer',
  navbar_member: 'navbar.member',
  navbar_internal: 'navbar.internal',
  navbar_other_language: 'navbar.internal',
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
