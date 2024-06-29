import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Link, SamfundetLogoSpinner } from '~/Components';
import { Child, ExpandableList, ExpandableListContextProvider, Parent } from '~/Components/ExpandableList';
import {
  getFormattedDate,
  getMonthForYearAndCategory,
  getSaksdokumenterForFilters,
  getYearsForCategory,
  monthValueToString,
} from '~/Components/ExpandableList/utils';
import { getSaksdokumenter } from '~/api';
import type { SaksdokumentDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { dbT, lowerCapitalize } from '~/utils';
import styles from './SaksdokumenterPage.module.scss';

export function SaksdokumenterPage() {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [saksdokumenter, setSaksdokumenter] = useState<SaksdokumentDto[]>();
  const [categories, setCategories] = useState<Array<string | undefined>>();

  useTitle(lowerCapitalize(t(KEY.common_documents)));

  // biome-ignore lint/correctness/useExhaustiveDependencies: t does not need to be in deplist
  useEffect(() => {
    getSaksdokumenter()
      .then((data) => {
        setSaksdokumenter(data);
        setCategories([...new Set(data.map((saksdokument) => saksdokument.category))]);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
      });
  }, []);

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
          <Link url={saksdokument.url ?? ''} target="backend" className={styles.child}>
            {dbT(saksdokument, 'title')}
          </Link>
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
        <Parent content={category || 'category'} key={category || `category${index}`} nestedDepth={0}>
          {yearMapping(category)}
        </Parent>
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
