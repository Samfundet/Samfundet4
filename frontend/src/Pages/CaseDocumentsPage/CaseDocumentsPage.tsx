import { useTranslation } from 'react-i18next';
import { Link, Page } from '~/Components';
import { Child, ExpandableList, ExpandableListContextProvider, Parent } from '~/Components/ExpandableList';
import {
  getCaseDocumentsForFilters,
  getFormattedDate,
  getMonthForYearAndCategory,
  getYearsForCategory,
  monthValueToString,
} from '~/Components/ExpandableList/utils';
import { useGetCaseDocumentCategories, useGetCaseDocuments } from '~/domain';
import type { CaseDocumentCategoryDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { dbT, lowerCapitalize } from '~/utils';
import styles from './CaseDocumentsPage.module.scss';

export function CaseDocumentsPage() {
  const { t } = useTranslation();

  useTitle(lowerCapitalize(t(KEY.common_documents)));

  const { data: categories, isLoading: categoriesLoading } = useGetCaseDocumentCategories();

  // TODO: change to only get published case documents
  const { data: caseDocuments, isLoading: documentsLoading } = useGetCaseDocuments();

  const isLoading = categoriesLoading || documentsLoading;

  function caseDocumentList(
    category: CaseDocumentCategoryDto,
    year: number | '' | undefined,
    month: number | '' | undefined,
  ) {
    return getCaseDocumentsForFilters(category, year, month, caseDocuments)?.map((document) => (
      <a href={document.file} target="_blank" rel="noreferrer" className={styles.child} key={document.id}>
        <Child key={document.id}>
          <p className={styles.date}>{document.publication_date && getFormattedDate(document.publication_date)}</p>
          <Link url={document.url ?? ''} target="backend" className={styles.child}>
            {dbT(document, 'title')}
          </Link>
        </Child>
      </a>
    ));
  }

  function monthMapping(category: CaseDocumentCategoryDto, year: number | undefined | '') {
    return getMonthForYearAndCategory(category, year, caseDocuments).map((month, index) => (
      <Parent content={monthValueToString(month) || 'month'} key={month || `month${index}`} nestedDepth={2}>
        {caseDocumentList(category, year, month)}
      </Parent>
    ));
  }

  function yearMapping(category: CaseDocumentCategoryDto) {
    return getYearsForCategory(category, caseDocuments).map((year, index) => (
      <Parent content={year || 'year'} key={year || `year${index}`} nestedDepth={1}>
        {monthMapping(category, year)}
      </Parent>
    ));
  }

  function categoryMapping() {
    return (
      categories &&
      caseDocuments &&
      categories.map((category, index) => (
        <Parent content={category.label || category.value} key={category.value} nestedDepth={0}>
          {yearMapping(category)}
        </Parent>
      ))
    );
  }

  return (
    <Page className={styles.container} loading={isLoading}>
      <ExpandableListContextProvider>
        <ExpandableList header={t(KEY.common_casedocuments)} depth={3}>
          {categoryMapping()}
        </ExpandableList>
      </ExpandableListContextProvider>
    </Page>
  );
}
