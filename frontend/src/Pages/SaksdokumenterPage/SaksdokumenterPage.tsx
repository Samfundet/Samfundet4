import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SamfundetLogoSpinner } from '~/Components';
import { getSaksdokumenter } from '~/api';
import { SaksdokumentDto } from '~/dto';
import { KEY, LANGUAGES } from '~/i18n/constants';
import { Child, ExpandableList, ExpandableListContextProvider, Parent } from '../../Components/ExpandableList';
import styles from './SaksdokumenterPage.module.scss';

export function SaksdokumenterPage() {
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const [saksdokumenter, setSaksdokumenter] = useState<SaksdokumentDto[]>();
  const [categories, setCategories] = useState<Array<string | undefined>>();
  const isNorwegian = i18n.language === LANGUAGES.NB;
  const navigate = useNavigate();

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

  function getFormattedDate(publication_date: string) {
    const date = new Date(publication_date);
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  }

  function getYearsForCategory(category: string | undefined) {
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

  function getMonthForYearAndCategory(category?: string, year?: number | '') {
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

  function getSaksdokumenterForFilters(category?: string, year?: number | '', month?: number | '') {
    const currentSaksdokument = saksdokumenter?.filter(
      (saksdokument) =>
        saksdokument.category === category &&
        saksdokument.publication_date &&
        new Date(saksdokument.publication_date).getFullYear() === year &&
        new Date(saksdokument.publication_date).getMonth() === month,
    );
    return currentSaksdokument;
  }

  function monthValueToString(month: number | '' | undefined) {
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

  function saksdokumentList(
    category: string | undefined,
    year: number | '' | undefined,
    month: number | '' | undefined,
  ) {
    return getSaksdokumenterForFilters(category, year, month)?.map((saksdokument) => (
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
    return getMonthForYearAndCategory(category, year).map((month) => (
      <Parent content={monthValueToString(month) || 'month'} key={month || 'month'} nestedDepth={2}>
        {saksdokumentList(category, year, month)}
      </Parent>
    ));
  }

  function yearMapping(category: string | undefined) {
    return getYearsForCategory(category).map((year) => (
      <Parent content={year || 'year'} key={year || 'year'} nestedDepth={1}>
        {monthMapping(category, year)}
      </Parent>
    ));
  }

  function categoryMapping() {
    return (
      categories &&
      saksdokumenter &&
      categories.map((category) => (
        <>
          {
            <Parent content={category || 'category'} key={category || 'category'} nestedDepth={0}>
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
