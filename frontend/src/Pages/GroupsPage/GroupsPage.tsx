/* eslint-disable max-len */
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getGangList } from '~/api';
import { ImageList } from '~/Components/ImageList';
import { ImageProps } from '~/Components/ImageList/ImageList';
import { Page } from '~/Components/Page';
import { GangDto, GangTypeDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { dbT } from '~/i18n/i18n';
import styles from './GroupsPage.module.scss';

/**
 * Page for displaying all the different groups ordered by what type of group they are
 * Such as Organizing, events, drift, then displaying all of these groups
 */
export function GroupsPage() {
  const { t, i18n } = useTranslation();
  const [groups, setGroups] = useState<GangTypeDto[]>([]);

  useEffect(() => {
    getGangList().then((data) => {
      setGroups(data);
    });
  }, []);

  return (
    <Page>
      <div className={styles.wrapper}>
        <div className={styles.description}>
          <h1 className={styles.header}>{t(KEY.gangs_title)}</h1>
          <p className={styles.description}>{t(KEY.gangs_text)}</p>
        </div>
        {groups.map((element: GangTypeDto, key: number) => (
          <div key={key} className={styles.groups}>
            <div className={styles.groupsTitle}>{dbT(element, 'title', i18n.language)}</div>
            <ImageList
              textMaxLength={12}
              images={
                element.gangs.map((element: GangDto) => ({
                  name_nb: element.name_nb,
                  name_en: element.name_en,
                  alt: element?.name_nb[0],
                  short: element.abbreviation,
                  url: element.info_page,
                  src: element.logo,
                })) as ImageProps[]
              }
              size={64}
              textClassName={styles.imageListText}
            />
          </div>
        ))}
      </div>
    </Page>
  );
}
