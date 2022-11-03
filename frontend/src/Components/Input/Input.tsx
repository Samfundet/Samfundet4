import { Children } from '~/types';
import styles from './Input.module.scss';

type InputProps = {
  children?: Children;
};

export function Input({ children }: InputProps) {
  return (
    <label className={styles.label}>
      {children}
      <input type="text" className={styles.input_field} />
    </label>
  );
}
