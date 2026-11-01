import { useTranslation } from 'react-i18next';
import { ImageList } from '~/Components/ImageList';
import type { ImageProps } from '~/Components/ImageList/ImageList';
import { Page } from '~/Components/Page';
import { TextItem } from '~/constants';
import { type GangDto, type GangTypeDto, useGetOrganizedGangs } from '~/domain';
import { useTextItem } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { dbT } from '~/utils';
import styles from './GangsPage.module.scss';

/**
 * Page for displaying all the different gangs ordered by what type of gangs they are
 * Such as Organizing, events, drift, then displaying all of these gangs
 */
export function GangsPage() {
  const { t } = useTranslation();
  const { data: gangs = [] } = useGetOrganizedGangs();

  return (
    <Page>
      <div className={styles.wrapper}>
        <div className={styles.description}>
          <h1 className={styles.header}>{t(KEY.gangspage_title)}</h1>
          <p className={styles.description}>{useTextItem(TextItem.gangspage_text)}</p>
        </div>
        {gangs.map((element: GangTypeDto) => (
          <div key={element.id} className={styles.gangs}>
            <div className={styles.gangsTitle}>{dbT(element, 'title')}</div>
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
