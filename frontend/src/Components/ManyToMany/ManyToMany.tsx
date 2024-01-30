import styles from './ManyToMany.module.scss';
import { ManyToManyPiece } from './ManyToManyPiece';

export function ManyToMany() {
  return (
    <div className={styles.wrapper}>
      <ManyToManyPiece title="test navn 1" elements={['elm 1', 'elm 2']}></ManyToManyPiece>
      <div className={styles.button_wrapper}>
        <button id={styles.button_left}></button>
        <button id={styles.button_right}></button>
      </div>
      <ManyToManyPiece title="test navn 2" elements={['elm 3', 'elm 4', 'elm 5', 'elm 6']}></ManyToManyPiece>
    </div>
  );
}
