import { useEffect, useState } from 'react';
import { getSaksdokumenter } from '~/api';
import { SamfundetLogoSpinner } from '~/Components';
import { SaksdokumentDto } from '~/dto';
import { Child, Parent } from './ExpandableList';
import styles from './SaksdokumenterPage.module.scss';
import { monthValueToString } from './utils';

export function SaksdokumenterPage() {
  const [loading, setLoading] = useState(true);
  const [saksdokumenter, setSaksdokumenter] = useState<SaksdokumentDto[]>();
  const [currentDepth, setCurrentDepth] = useState<Array<string | number | undefined>>([]);
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

  return loading ? (
    <div className={styles.container}>
      <SamfundetLogoSpinner />
    </div>
  ) : (
    <div className={styles.container}>
      <div className={styles.content_container}>
        <div className={styles.header}>
          {currentDepth.length != 0 && (
            <div
              className={styles.back_button}
              onClick={() => {
                setCurrentDepth(currentDepth.filter((depth) => depth !== currentDepth[currentDepth.length - 1]));
              }}
            >
              ↩︎
            </div>
          )}
          <h3>Saksdokumenter</h3>
        </div>
        {categories &&
          saksdokumenter &&
          categories.map((category) => (
            <>
              {
                <Parent
                  onClick={() => {
                    setCurrentDepth((currentDepth) => [...currentDepth, category]);
                  }}
                  visible={currentDepth.length === 0}
                  content={category || 'category'}
                  key={category || 'category'}
                >
                  {getYearsForCategory(category).map((year) => (
                    <Parent
                      onClick={() => {
                        setCurrentDepth((currentDepth) => [...currentDepth, year]);
                      }}
                      visible={currentDepth[currentDepth.length - 1] === category}
                      content={year || 'year'}
                      key={year || 'year'}
                    >
                      {getMonthForYearAndCategory(category, year).map((month) => (
                        <Parent
                          onClick={() => {
                            setCurrentDepth((currentDepth) => [...currentDepth, month]);
                          }}
                          visible={
                            currentDepth[currentDepth.length - 1] === year &&
                            currentDepth[currentDepth.length - 2] === category
                          }
                          content={monthValueToString(month) || 'month'}
                          key={month || 'month'}
                        >
                          {getSaksdokumenterForFilters(category, year, month)?.map((saksdokument) => (
                            <Child
                              content={saksdokument.title_no || 'undefined'}
                              fileLocation={saksdokument.file || 'undefined'}
                              key={saksdokument.id}
                              visible={
                                currentDepth[currentDepth.length - 1] === month &&
                                currentDepth[currentDepth.length - 2] === year &&
                                currentDepth[currentDepth.length - 3] === category
                              }
                            />
                          ))}
                        </Parent>
                      ))}
                    </Parent>
                  ))}
                </Parent>
              }
            </>
          ))}
      </div>
    </div>
  );
}
