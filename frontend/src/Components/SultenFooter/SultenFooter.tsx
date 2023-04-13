import { Icon } from '@iconify/react';
import { useKeyValue } from '~/hooks';
import { ROUTES } from '~/routes';
import styles from './SultenFooter.module.scss';
import { KV } from '~/constants';

export function SultenFooter() {
  const sultenMail = useKeyValue(KV.SULTEN_MAIL);
  const sultenAdress = 'Elgsetergate 1';

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
        <a href={`mailto:${sultenMail}`}>
          <Icon icon="material-symbols:mail" className={styles.icon}></Icon>
        </a>
        <a className={styles.footer_link} href={`mailto:${sultenMail}`}>
          {sultenMail}
        </a>
      </div>
      <div className={styles.footer_item}>
        <a href={ROUTES.other.maps_elgsetergate_1}>
          <Icon icon="mdi:address-marker-outline" className={styles.icon}></Icon>
        </a>
        <a className={styles.footer_link} href={ROUTES.other.maps_elgsetergate_1}>
          {sultenAdress}
        </a>
      </div>
    </div>
  );
}
