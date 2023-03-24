import { Icon } from '@iconify/react';
import styles from './SultenFooter.module.scss';

export function SultenFooter() {
  return (
    <div className={styles.footer_container}>
      <h2 className={styles.header}>Lyche</h2>
      <div className={styles.footer_item}>
        <a href="https://www.instagram.com/lychekjokkenogbar/">
          <Icon
            icon="ph:instagram-logo-light"
            className={styles.icon}
            href="https://www.instagram.com/lychekjokkenogbar/"
          ></Icon>
        </a>
        <a className={styles.footer_link} href="https://www.instagram.com/lychekjokkenogbar/">
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
        <a href="https://goo.gl/maps/av8ogQPgwWU5ahKr6">
          <Icon icon="mdi:address-marker-outline" className={styles.icon}></Icon>
        </a>
        <a className={styles.footer_link} href="https://goo.gl/maps/av8ogQPgwWU5ahKr6">
          Elgsetergate 1
        </a>
      </div>
    </div>
  );
}
