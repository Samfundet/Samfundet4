/* eslint-disable max-len */
import { Page } from '~/Components/Page';
import { ImageList } from '~/Components/ImageList';

import styles from './GroupsPage.module.scss';
import { groups } from './data';

import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
/**
 * Page for displaying all the different groups ordered by what type of group they are
 * Such as Organizing, events, drift, then displaying all of these groups
 */
export function GroupsPage() {
  const { t } = useTranslation();
  return (
    <Page>
      <div className={styles.wrapper}>
        <div className={styles.description}>
          <h1>{t(KEY.gangs_title)}</h1>
          <p>{t(KEY.gangs_text)}</p>
        </div>
        {groups.map((element, key) => (
          <div key={key} className={styles.groups}>
            <div className={styles.groupsTitle}>{element.title}</div>
            <ImageList images={element.groups} size={64} />
          </div>
        ))}
      </div>
    </Page>
  );
}
