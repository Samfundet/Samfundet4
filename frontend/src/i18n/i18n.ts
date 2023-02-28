import { use } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { LANGUAGES } from './constants';
import { en, nb } from './translations';

export const defaultNS = 'common';

export const resources = {
  [LANGUAGES.NB]: { [defaultNS]: nb },
  [LANGUAGES.EN]: { [defaultNS]: en },
};

/**
 * Function for translation object fields, such as title_nb and title_en.
 * If there is no translation for the field the common name would be given
 * @param {Record<string, unknown>}  model - The object to translate
 * @param {string} field - the field to be translated, use root of the field, such as title, name
 * @param {string} language- the language, use i18n.language for dynamic translation
 */
export function dbT(model: Record<string, string>, field: string, language: string): string {
  if (Object.prototype.hasOwnProperty.call(model, field + '_' + language)) {
    return model[field + '_' + language];
  } else return model[field];
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
