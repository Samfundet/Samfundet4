import { Icon } from '@iconify/react';
import styles from './SultenFooter.module.scss';

export function SultenFooter() {
  return (
    <div className={styles.footer_container}>
      <h2 className={styles.header}>Lyche</h2>
      <div className={styles.footer_item}>
        <Icon icon="ph:instagram-logo-light" className={styles.icon}></Icon>
        <a className={styles.footer_link}>lychekjokkenogbar</a>
      </div>
      <div className={styles.footer_item}>
        <Icon icon="material-symbols:mail" className={styles.icon}></Icon>
        <a className={styles.footer_link}>lyche@samfundet.no</a>
      </div>
      <div className={styles.footer_item}>
        <Icon icon="mdi:address-marker-outline" className={styles.icon}></Icon>
        <a className={styles.footer_link}>Elgsetergate 1</a>
      </div>
    </div>
  );
}
