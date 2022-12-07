import { useEffect, useState } from 'react';
import { getSaksdokumenter } from '~/api';
import { SamfundetLogoSpinner } from '~/Components';
import { SaksdokumentDto } from '~/dto';
import { Parent } from './ExpandableList';
import styles from './SaksdokumenterPage.module.scss';

export function SaksdokumenterPage() {
  const [loading, setLoading] = useState(true);
  const [saksdokumenter, setSaksdokumenter] = useState<SaksdokumentDto[]>();
  const [currentDepth, setCurrentDepth] = useState<Array<string | number | undefined>>([]);
  const [categories, setCategories] = useState<Array<string | undefined>>();
  const [years, setYears] = useState<Array<number | undefined>>();
  const [currentSaksdokument, setCurrentSaksdokument] = useState<SaksdokumentDto[]>();

  useEffect(() => {
    getSaksdokumenter().then((data) => {
      setSaksdokumenter(data);
      setCategories([...new Set(data.map((saksdokument) => saksdokument.category))]);
      setLoading(false);
    });
  }, []);

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
                    console.log(currentDepth);
                    setCurrentSaksdokument(saksdokumenter.filter((saksdokument) => saksdokument.category === category));
                    setYears([
                      ...new Set(
                        saksdokumenter?.map((saksdokument) =>
                          saksdokument.publication_date
                            ? new Date(saksdokument.publication_date).getFullYear()
                            : undefined,
                        ),
                      ),
                    ]);
                    console.log(currentSaksdokument);
                    console.log(years);
                  }}
                  visible={currentDepth.length === 0}
                  content={category || 'category'}
                  key={category || 'category'}
                >
                  {years &&
                    currentDepth[currentDepth.length - 1] === category &&
                    years.map((year) => (
                      <Parent
                        onClick={() => {
                          setCurrentDepth((currentDepth) => [...currentDepth, year]);
                          setCurrentSaksdokument(
                            currentSaksdokument?.filter((saksdokument) =>
                              saksdokument.publication_date
                                ? new Date(saksdokument.publication_date).getFullYear() === year
                                : false,
                            ),
                          );
                        }}
                        visible={currentDepth.length === 1}
                        content={year || 'year'}
                        key={year || 'year'}
                      >
                        {years &&
                          currentDepth[currentDepth.length - 1] === category &&
                          years.map((year) => (
                            <Parent
                              onClick={() => {
                                setCurrentDepth((currentDepth) => [...currentDepth, year]);
                                setCurrentSaksdokument(
                                  currentSaksdokument?.filter((saksdokument) =>
                                    saksdokument.publication_date
                                      ? new Date(saksdokument.publication_date).getFullYear() === year
                                      : false,
                                  ),
                                );
                              }}
                              visible={currentDepth.length === 1}
                              content={year || 'year'}
                              key={year || 'year'}
                            >
                              {/* {saksdokumenter &&
                          currentDepth.length === 2 &&
                          saksdokumenter
                            .filter(
                              (saksdokument) =>
                                saksdokument.category === currentDepth[currentDepth.length - 2] &&
                                saksdokument.publication_date &&
                                new Date(saksdokument.publication_date).getFullYear() === year,
                            )
                            .map(
                              (saksdokument) =>
                                saksdokument.category === category && (
                                  <Child
                                    content={saksdokument.title_no || 'undefined'}
                                    fileLocation={saksdokument.file || 'undefined'}
                                    key={saksdokument.id}
                                  />
                                ),
                            )} */}
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
