import type { InformationPageDto } from '~/dto';
import { LANGUAGES } from '~/i18n/types';

export function getTranslatedTitle(page: InformationPageDto | undefined, language: string): string | undefined {
  let title = undefined;
  if (language === LANGUAGES.EN) {
    title = page?.title_en;
  }
  if (language === LANGUAGES.NB) {
    title = page?.title_nb;
  }
  return title;
}
