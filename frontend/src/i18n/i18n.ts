import { use } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en, nb } from './translations';
import translationEN from './zod/en/zod.json';
import translationNB from './zod/nb/zod.json';
import { LANGUAGES } from './types';

export const defaultNS = 'common';

export const resources = {
  [LANGUAGES.NB]: { [defaultNS]: nb, zod: translationNB },
  [LANGUAGES.EN]: { [defaultNS]: en, zod: translationEN },
};

const devSetting = process.env.NODE_ENV === 'development';

use(initReactI18next).init({
  lng: LANGUAGES.NB,
  fallbackLng: LANGUAGES.NB,
  resources: resources,
  defaultNS: defaultNS,
  nsSeparator: false,
  debug: devSetting,
});
