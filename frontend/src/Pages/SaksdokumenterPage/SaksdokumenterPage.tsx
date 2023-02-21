import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SamfundetLogoSpinner } from '~/Components';
import { Child, ExpandableList, ExpandableListContextProvider, Parent } from '~/Components/ExpandableList';
import {
  getFormattedDate,
  getMonthForYearAndCategory,
  getSaksdokumenterForFilters,
  getYearsForCategory,
  monthValueToString,
} from '~/Components/ExpandableList/utils';
import { getSaksdokumenter } from '~/api';
import { SaksdokumentDto } from '~/dto';
import { LANGUAGES } from '~/i18n/constants';
import styles from './SaksdokumenterPage.module.scss';

export function SaksdokumenterPage() {
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();
  const [saksdokumenter, setSaksdokumenter] = useState<SaksdokumentDto[]>();
  const [categories, setCategories] = useState<Array<string | undefined>>();
  const isNorwegian = i18n.language === LANGUAGES.NB;

  useEffect(() => {
    getSaksdokumenter().then((data) => {
      setSaksdokumenter(data);
      setCategories([...new Set(data.map((saksdokument) => saksdokument.category))]);
      setLoading(false);
    });
  }, []);

  function titleForSaksdokument(saksdokument: SaksdokumentDto) {
    return isNorwegian ? saksdokument.title_nb : saksdokument.title_en;
  }

  function saksdokumentList(
    category: string | undefined,
    year: number | '' | undefined,
    month: number | '' | undefined,
  ) {
    return getSaksdokumenterForFilters(category, year, month, saksdokumenter)?.map((saksdokument) => (
      <a href={saksdokument.file} target="_blank" rel="noreferrer" className={styles.child} key={saksdokument.id}>
        <Child key={saksdokument.id}>
          <p className={styles.date}>
            {saksdokument.publication_date && getFormattedDate(saksdokument.publication_date)}
          </p>
          <a href={saksdokument.file} target="_blank" rel="noreferrer" className={styles.child}>
            {titleForSaksdokument(saksdokument)}
          </a>
        </Child>
      </a>
    ));
  }

  function monthMapping(category: string | undefined, year: number | undefined | '') {
    return getMonthForYearAndCategory(category, year, saksdokumenter).map((month, index) => (
      <Parent content={monthValueToString(month) || 'month'} key={month || `month${index}`} nestedDepth={2}>
        {saksdokumentList(category, year, month)}
      </Parent>
    ));
  }

  function yearMapping(category: string | undefined) {
    return getYearsForCategory(category, saksdokumenter).map((year, index) => (
      <Parent content={year || 'year'} key={year || `year${index}`} nestedDepth={1}>
        {monthMapping(category, year)}
      </Parent>
    ));
  }

  function categoryMapping() {
    return (
      categories &&
      saksdokumenter &&
      categories.map((category, index) => (
        <>
          {
            <Parent content={category || 'category'} key={category || `category${index}`} nestedDepth={0}>
              {yearMapping(category)}
            </Parent>
          }
        </>
      ))
    );
  }

  if (loading) {
    <SamfundetLogoSpinner />;
  }

  return (
    <div className={styles.container}>
      <ExpandableListContextProvider>
        <ExpandableList header="" depth={3}>
          {categoryMapping()}
        </ExpandableList>
      </ExpandableListContextProvider>
    </div>
  );
}
