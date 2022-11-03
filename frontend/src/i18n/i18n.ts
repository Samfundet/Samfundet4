import i18next, { i18n as i18nInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { LANGUAGES } from './i18n.constants';
import { nb, en } from './i18n.translations';

const createI18n = (): i18nInstance => {
  const i18n = i18next.createInstance().use(initReactI18next);

  i18n.init({
    lng: LANGUAGES.NB,
    fallbackLng: LANGUAGES.NB,
    resources: {
      [LANGUAGES.NB]: nb,
      [LANGUAGES.EN]: en,
    },
  });

  return i18n;
};

export const i18n = createI18n();
