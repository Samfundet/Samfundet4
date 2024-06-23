import { type ColorKey, COLORS } from '~/types';
import styles from './ColorDisplay.module.scss';

type ColorDisplayProps = {
  color: ColorKey;
};

export function ColorDisplay({ color }: ColorDisplayProps) {
  const bg = COLORS[color];
  return (
    <div className={styles.div}>
      <div className={styles.dot} style={{ backgroundColor: bg }} />
      <div>{`Farge: ${bg}`}</div>
      <div>{`Navn: ${color}`}</div>
    </div>
  );
}
