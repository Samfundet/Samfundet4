import { Children } from '~/types';
import styles from './Input.module.scss';

type InputProps = {
  children?: Children;
  className?: string;
};

export function Input({ children, className }: InputProps) {
  return (
    <label className={styles.label}>
      {children}
      <input type="text" className={`${styles.input_field} ${className}`} />
    </label>
  );
}
