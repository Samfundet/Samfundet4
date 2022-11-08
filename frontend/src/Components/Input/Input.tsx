import { Children } from '~/types';
import styles from './Input.module.scss';

type InputProps = {
  children?: Children;
  className?: string;
  onChange?: (e?: React.ChangeEvent<HTMLInputElement>) => void;
};

export function Input({ children, className, onChange }: InputProps) {
  return (
    <label className={styles.label}>
      {children}
      <input onChange={onChange} type="text" className={`${styles.input_field} ${className}`} />
    </label>
  );
}
