export const KEY = {
  navbar_event: 'event',
  navbar_information: 'information',
  navbar_restaurant: 'restaurant',
  navbar_volunteer: 'voulenteer',
  navbar_member: 'member',
  navbar_internal: 'internal',
  navbar_other_language: 'internal',
} as const;

export type KeyKeys = keyof typeof KEY;
export type KeyValues = typeof KEY[KeyKeys];

export const LANGUAGES = {
  NB: 'nb',
  EN: 'en',
};
