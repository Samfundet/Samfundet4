/* eslint-disable max-len */
import { ImageList } from '~/Components/ImageList';

import styles from './GroupsPage.module.scss';
import { Page } from '~/Components/Page';

/**
 * Page to render all components for easy overview and debug purposes.
 * Useful when styling global themes.
 */

const groups = [
  {
    title: 'Styrende organ',
    groups: [
      {
        title: 'Finansstyret',
        src: '',
      },
      {
        title: 'Rådet',
        src: '',
      },
      {
        title: 'Styret',
        src: '',
      },
    ],
  },
  {
    title: 'Arrangerende',
    groups: [
      {
        title: 'Klubbstyret',
        src: 'https://samfundet.no/assets/groups/klubbstyret-f37c39cce0a51ab5eb0166b930f2503a29945e183152945492d68c01dee11a2b.jpg',
      },
      {
        title: 'KU',
        src: 'https://samfundet.no/assets/groups/kulturutvalget-c24ce5bf9dfb4cc6814d1f92b664ab153f750694cf649203ebcc9135cd31366e.jpg',
      },
      { title: 'LØK', src: '' },
    ],
  },
  {
    title: 'Diverse',
    groups: [
      {
        title: 'Klubbstyret',
        src: 'https://samfundet.no/assets/groups/klubbstyret-f37c39cce0a51ab5eb0166b930f2503a29945e183152945492d68c01dee11a2b.jpg',
      },
      {
        title: 'KU',
        src: 'https://samfundet.no/assets/groups/kulturutvalget-c24ce5bf9dfb4cc6814d1f92b664ab153f750694cf649203ebcc9135cd31366e.jpg',
      },
      { title: 'LØK', src: '' },
      {
        title: 'Klubbstyret',
        src: 'https://samfundet.no/assets/groups/klubbstyret-f37c39cce0a51ab5eb0166b930f2503a29945e183152945492d68c01dee11a2b.jpg',
      },
      {
        title: 'KU',
        src: 'https://samfundet.no/assets/groups/kulturutvalget-c24ce5bf9dfb4cc6814d1f92b664ab153f750694cf649203ebcc9135cd31366e.jpg',
      },
      { title: 'LØK', src: '' },
      {
        title: 'Klubbstyret',
        src: 'https://samfundet.no/assets/groups/klubbstyret-f37c39cce0a51ab5eb0166b930f2503a29945e183152945492d68c01dee11a2b.jpg',
      },
      {
        title: 'KU',
        src: 'https://samfundet.no/assets/groups/kulturutvalget-c24ce5bf9dfb4cc6814d1f92b664ab153f750694cf649203ebcc9135cd31366e.jpg',
      },
      { title: 'LØK', src: '' },
    ],
  },

] //TODO DELETE WHEN IMPLEMENTED

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
        {groups.map(function (element, key) {
          return (
            <div key={key} className={styles.groups}>
              <div className={styles.groupsTitle}>{element.title}</div>
              <ImageList images={element.groups} size={64} />
            </div>
          );
        })}
      </div>
    </Page>
  );
}
