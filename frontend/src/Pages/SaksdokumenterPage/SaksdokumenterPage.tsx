import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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

  useEffect(() => {
    getSaksdokumenter().then((data) => {
      setSaksdokumenter(data);
      setCategories([...new Set(data.map((saksdokument) => saksdokument.category))]);
      setLoading(false);
    });
  }, []);

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

  function getFormattedDate(publication_date: string) {
    const date = new Date(publication_date);
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  }

  return loading ? (
    <div className={styles.container}>
      <SamfundetLogoSpinner />
    </div>
  ) : (
    <div className={styles.container}>
      <ExpandableListContextProvider>
        <ExpandableList header="" depth={3}>
          {categories &&
            saksdokumenter &&
            categories.map((category) => (
              <>
                {
                  <Parent content={category || 'category'} key={category || 'category'} nestedDepth={0}>
                    {getYearsForCategory(category).map((year) => (
                      <Parent content={year || 'year'} key={year || 'year'} nestedDepth={1}>
                        {getMonthForYearAndCategory(category, year).map((month) => (
                          <Parent content={monthValueToString(month) || 'month'} key={month || 'month'} nestedDepth={2}>
                            {getSaksdokumenterForFilters(category, year, month)?.map((saksdokument) => (
                              <Child key={saksdokument.id}>
                                <div>
                                  {saksdokument.publication_date && getFormattedDate(saksdokument.publication_date)}
                                </div>
                                <a href={saksdokument.file} target="_blank" rel="noreferrer" className={styles.child}>
                                  {i18n.language === LANGUAGES.NB ? saksdokument.title_nb : saksdokument.title_en}
                                </a>
                              </Child>
                            ))}
                          </Parent>
                        ))}
                      </Parent>
                    ))}
                  </Parent>
                }
              </>
            ))}
        </ExpandableList>
      </ExpandableListContextProvider>
    </div>
  );
}
