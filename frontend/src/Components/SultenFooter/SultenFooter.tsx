import { Icon } from '@iconify/react';
import { ROUTES } from '~/routes';
import styles from './SultenFooter.module.scss';

export function SultenFooter() {
  return (
    <div className={styles.footer_container}>
      <h2 className={styles.header}>Lyche</h2>
      <div className={styles.footer_item}>
        <a href={ROUTES.other.sulten_instagram}>
          <Icon icon="ph:instagram-logo-light" className={styles.icon}></Icon>
        </a>
        <a className={styles.footer_link} href={ROUTES.other.sulten_instagram}>
          lychekjokkenogbar
        </a>
      </div>
      <div className={styles.footer_item}>
        <a href="mailto:lyche@samfundet.no">
          <Icon icon="material-symbols:mail" className={styles.icon}></Icon>
        </a>
        <a className={styles.footer_link} href="mailto:lyche@samfundet.no">
          lyche@samfundet.no
        </a>
      </div>
      <div className={styles.footer_item}>
        <a href={ROUTES.other.maps_elgsetergate_1}>
          <Icon icon="mdi:address-marker-outline" className={styles.icon}></Icon>
        </a>
        <a className={styles.footer_link} href={ROUTES.other.maps_elgsetergate_1}>
          Elgsetergate 1
        </a>
      </div>
    </div>
  );
}
