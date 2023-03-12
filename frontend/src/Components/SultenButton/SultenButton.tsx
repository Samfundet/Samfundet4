import { default as classnames } from 'classnames';
import { ButtonType, Children } from '~/types';
import styles from './SultenButton.module.scss';

type ButtonProps = {
  name?: string;
  type?: ButtonType;
  className?: string;
  disabled?: boolean;
  children?: Children;
  onClick?: () => void;
};

export function SultenButton({ name, type, onClick, disabled, className, children }: ButtonProps) {
  const classNames = classnames(styles.button, className, styles.button_basic);
  return (
    <button name={name} onClick={onClick} type={type} disabled={disabled} className={classNames}>
      {children}
    </button>
  );
}
