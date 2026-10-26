import { useState } from 'react';
import { Category } from './Category';
import styles from './Category.module.scss';

export function GangCategory() {
  const [viewSection, setViewSection] = useState(false);

  const header = (
    <>
      <h2>Gang</h2>
    </>
  );

  return (
    <Category header={header}>
      <div className={styles.select}>
        <div className={styles.selectGang} />
        <div className={styles.selectSection} />
      </div>
      <span>uwu</span>
    </Category>
  );
}
