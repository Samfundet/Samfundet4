import type { Plural, Translations, i18nTranslations } from './types';

export function validateKeyEqualsValue(obj: Record<string, string>): void {
  for (const key in obj) {
    if (key !== obj[key]) {
      throw Error(`${key} doesn't match ${obj[key]}`);
    }
  }
}

/**
 * OBS: These are language dependant.
 * We kept only those supported by NB and EN.
 * https://www.i18next.com/translation-function/plurals
 */
export const PLURAL = {
  ZERO: 'zero',
  ONE: 'one',
  OTHER: 'other',
} as const;

/**
 * Function to transform our custom setup with i18n.
 * 
 * 
 * Example:

```js
// input
{
  [KEY.some_normal_key]: 'Om tjenesten',
  [KEY.some_plural_key]: {
    [PLURAL.ZERO]: 'Ingen personer',
    [PLURAL.ONE]: '{{count}} person',
    [PLURAL.OTHER]: '{{count}} personer',
  }
}
```

```js
// output
{
    'some_normal_key': 'Om tjenesten',
    'some_plural_key_zero': 'Ingen personer',
    'some_plural_key_one': '{{count}} person',
    'some_plural_key_other': '{{count}} personer',
}
```
 */
export function prepareTranslations(translations: Translations): i18nTranslations {
  const output = Object.entries(translations).reduce((acc, [key, value]) => {
    if (typeof value === 'object') {
      const subKeys = Object.keys(value) as Plural[];
      subKeys.forEach((subKey) => {
        const newKey = `${key}_${subKey}`;
        acc[newKey] = value[subKey] as string;
      });
    } else {
      acc[key] = value;
    }
    return acc;
  }, {} as i18nTranslations);
  return output;
}
