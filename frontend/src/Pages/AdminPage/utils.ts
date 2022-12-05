import { LANGUAGES } from '~/i18n/constants';

export function getTranslatedText(page: InformationPageDto | undefined, language: string): string | undefined {
  let text = undefined;
  if (language === LANGUAGES.EN) {
    text = page?.text_en;
  }
  if (language === LANGUAGES.NB) {
    text = page?.text_no;
  }
  return text;
}
