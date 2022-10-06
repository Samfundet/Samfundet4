import React from 'react';
import styles from './EventPage.module.scss';

export function EventPage() {
  console.log('Inside event page!');
  return (
    <div className={styles.container}>
      <div>
        <img id="banner-link"></img>
      </div>
      <div className={styles.container_list}>
        <table>
          <tr>
            <td className={styles.table_element_left}> LOKALE </td>
            <td className={styles.table_element_right}> STORSALEN </td>
          </tr>
          <tr>
            <td className={styles.table_element_left}> ARRANGØR </td>
            <td className={styles.table_element_right}> STORSALEN </td>
          </tr>
          <tr>
            <td className={styles.table_element_left}> DATO </td>
            <td className={styles.table_element_right}> STORSALEN </td>
          </tr>
          <tr>
            <td className={styles.table_element_left}> TID </td>
            <td className={styles.table_element_right}> STORSALEN </td>
          </tr>
          <tr>
            <td className={styles.table_element_left}> BILLETT </td>
            <td className={styles.table_element_right}> STORSALEN </td>
          </tr>
          <tr>
            <td className={styles.table_element_left}> ALDERSGRENSE </td>
            <td className={styles.table_element_right}> STORSALEN </td>
          </tr>
        </table>
      </div>
      <div className={styles.description}>
        <p className={styles.text_title}> DESCRIPTION </p>
        <div className={styles.description}>
          <div className={styles.description_short}>
            <p className={styles.text_short}>
              {' '}
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo autem laudantium fuga saepe architecto
              consectetur nihil.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo autem laudantium fuga
              architecto consectetur nihil.Lorem ipsum dolor sit amet, consectetur adipisicing elit.{' '}
            </p>
          </div>
          <div className={styles.description_long}>
            <p>
              {' '}
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo autem laudantium fuga saepe architecto
              consectetur nihil.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo autem laudantium fuga
              architecto consectetur nihil.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo autem
              laudantium fuga saepe architecto consectetur nihil.Lorem ipsum dolor sit amet, consectetur adipisicing
              elit. Illo autem laudantium fuga saepe architecto consectetur nihil.{' '}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
