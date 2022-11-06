export const KEY = {
  title: 'title',
} as const;

export type KeyKeys = keyof typeof KEY;
export type KeyValues = typeof KEY[KeyKeys];

export const LANGUAGES = {
  NB: 'nb',
  EN: 'en',
};
