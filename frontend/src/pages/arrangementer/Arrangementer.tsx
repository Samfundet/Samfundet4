import React from 'react';
import { Button } from '../../Components';
import styles from './Arrangementer.module.scss';

export function Arrangementer() {
  return (
    <div className={styles.container}>
      <h2>Arrangementer</h2>
      <p>{'// TODO Implement this'}</p>
      <Button className="test" name={'hei'}>
        Hei
      </Button>
      <Button className="test" theme="secondary" name={'hei'}>
        Hei
      </Button>
    </div>
  );
}
