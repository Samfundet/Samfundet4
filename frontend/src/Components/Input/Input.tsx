import { Children } from 'types';
import styles from './Input.module.scss';

type InputProps = {
  children?: Children;
};

export function Input({ children }: InputProps) {
  return (
    <label>
      {children}
      <input type="text" className=".input_samf" />
    </label>
  );
}
