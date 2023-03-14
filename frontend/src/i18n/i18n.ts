import { use } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { LANGUAGES } from './constants';
import { en, nb } from './translations';

export const defaultNS = 'common';

export const resources = {
  [LANGUAGES.NB]: { [defaultNS]: nb },
  [LANGUAGES.EN]: { [defaultNS]: en },
};

export function dbT(model: Record<string, unknown> | undefined, field: string, language: string): unknown {
  if (model === undefined) return undefined;
  return model[field + '_' + language];
}

const devSetting = process.env.NODE_ENV === 'development' ? true : false;

use(initReactI18next).init({
  lng: LANGUAGES.NB,
  fallbackLng: LANGUAGES.NB,
  resources: resources,
  defaultNS: defaultNS,
  nsSeparator: false,
  debug: devSetting,
});
