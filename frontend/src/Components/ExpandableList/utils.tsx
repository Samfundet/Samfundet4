import { t } from 'i18next';
import type { CaseDocumentCategoryDto, CaseDocumentDto } from '~/dto';
import { KEY } from '~/i18n/constants';

export function monthValueToString(month: number | '' | undefined) {
  const months = [
    t(KEY.common_month_january),
    t(KEY.common_month_february),
    t(KEY.common_month_march),
    t(KEY.common_month_april),
    t(KEY.common_month_may),
    t(KEY.common_month_june),
    t(KEY.common_month_july),
    t(KEY.common_month_august),
    t(KEY.common_month_september),
    t(KEY.common_month_october),
    t(KEY.common_month_november),
    t(KEY.common_month_december),
  ];
  return month ? months[month] : '-';
}

export function getFormattedDate(publication_date: string) {
  const date = new Date(publication_date);
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}

export function getCaseDocumentsForFilters(
  category: CaseDocumentCategoryDto,
  year?: number | '',
  month?: number | '',
  caseDocuments?: CaseDocumentDto[],
) {
  return caseDocuments?.filter(
    (document) =>
      document.category === category.value &&
      document.publication_date &&
      new Date(document.publication_date).getFullYear() === year &&
      new Date(document.publication_date).getMonth() === month,
  );
}

export function getMonthForYearAndCategory(
  category: CaseDocumentCategoryDto,
  year?: number | '',
  caseDocuments?: CaseDocumentDto[],
) {
  const currentDocument = caseDocuments?.filter(
    (document) =>
      document.category === category.value &&
      document.publication_date &&
      new Date(document.publication_date).getFullYear() === year,
  );
  return [
    ...new Set(
      currentDocument?.map((document) => document.publication_date && new Date(document.publication_date).getMonth()),
    ),
  ];
}

export function getYearsForCategory(category: CaseDocumentCategoryDto, caseDocuments?: CaseDocumentDto[]) {
  if (!category) {
    return [];
  }
  const currentDocument = caseDocuments?.filter((document) => document.category === category.value);
  return [
    ...new Set(
      currentDocument?.map(
        (document) => document.publication_date && new Date(document.publication_date).getFullYear(),
      ),
    ),
  ];
}
