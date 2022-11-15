/* eslint-disable max-len */
import { Page } from '~/Components/Page';
import { ImageList } from '~/Components/ImageList';

import styles from './GroupsPage.module.scss';
import { groups } from './data';

/**
 * Page for displaying all the different groups ordered by what type of group they are
 * Such as Organizing, events, drift, then displaying all of these groups
 */
export function GroupsPage() {
  return (
    <Page>
      <div className={styles.wrapper}>
        <div className={styles.description}>
          <h1>Gjengene på Samfundet</h1>
          <p>
            Samfundet består av mer enn 20 gjenger som jobber med blandt annet lyd, lys, teater, snekring, IT,
            artistbooking, korsang, markedsføring, musikk og mye annet. Gjengene er organisert i følgende grupperinger:
          </p>
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
