import { t } from 'i18next';
import { SaksdokumentDto } from '~/dto';
import { KEY } from '~/i18n/constants';

export function monthValueToString(month: number | '' | undefined) {
  const months = [
    t(KEY.month_january),
    t(KEY.month_february),
    t(KEY.month_march),
    t(KEY.month_april),
    t(KEY.month_may),
    t(KEY.month_june),
    t(KEY.month_july),
    t(KEY.month_august),
    t(KEY.month_september),
    t(KEY.month_october),
    t(KEY.month_november),
    t(KEY.month_december),
  ];
  return month ? months[month] : '-';
}

export function getFormattedDate(publication_date: string) {
  const date = new Date(publication_date);
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}

export function getSaksdokumenterForFilters(
  category?: string,
  year?: number | '',
  month?: number | '',
  saksdokumenter?: SaksdokumentDto[],
) {
  const currentSaksdokument = saksdokumenter?.filter(
    (saksdokument) =>
      saksdokument.category === category &&
      saksdokument.publication_date &&
      new Date(saksdokument.publication_date).getFullYear() === year &&
      new Date(saksdokument.publication_date).getMonth() === month,
  );
  return currentSaksdokument;
}

export function getMonthForYearAndCategory(category?: string, year?: number | '', saksdokumenter?: SaksdokumentDto[]) {
  const currentSaksdokument = saksdokumenter?.filter(
    (saksdokument) =>
      saksdokument.category === category &&
      saksdokument.publication_date &&
      new Date(saksdokument.publication_date).getFullYear() === year,
  );
  const months = [
    ...new Set(
      currentSaksdokument?.map(
        (saksdokument) => saksdokument.publication_date && new Date(saksdokument.publication_date).getMonth(),
      ),
    ),
  ];
  return months;
}

export function getYearsForCategory(category: string | undefined, saksdokumenter?: SaksdokumentDto[]) {
  if (!category) {
    return [];
  }
  const currentSaksdokument = saksdokumenter?.filter((saksdokument) => saksdokument.category === category);
  const years = [
    ...new Set(
      currentSaksdokument?.map(
        (saksdokument) => saksdokument.publication_date && new Date(saksdokument.publication_date).getFullYear(),
      ),
    ),
  ];
  return years;
}
