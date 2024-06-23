/* eslint-disable max-len */
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { ImageList } from '~/Components/ImageList';
import type { ImageProps } from '~/Components/ImageList/ImageList';
import { Page } from '~/Components/Page';
import { getGangList } from '~/api';
import type { GangDto, GangTypeDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { dbT } from '~/utils';
import styles from './GroupsPage.module.scss';

/**
 * Page for displaying all the different groups ordered by what type of group they are
 * Such as Organizing, events, drift, then displaying all of these groups
 */
export function GroupsPage() {
  const { t } = useTranslation();
  const [groups, setGroups] = useState<GangTypeDto[]>([]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: t does not need to be in deplist
  useEffect(() => {
    getGangList()
      .then((data) => {
        setGroups(data);
      })
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
      });
  }, []);

  return (
    <Page>
      <div className={styles.wrapper}>
        <div className={styles.description}>
          <h1 className={styles.header}>{t(KEY.groupspage_gangs_title)}</h1>
          <p className={styles.description}>{t(KEY.groupspage_gangs_text)}</p>
        </div>
        {groups.map((element: GangTypeDto, key: number) => (
          <div key={key} className={styles.groups}>
            <div className={styles.groupsTitle}>{dbT(element, 'title')}</div>
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
