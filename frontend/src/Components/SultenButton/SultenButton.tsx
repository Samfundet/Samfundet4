import { default as classnames } from 'classnames';
import { Link } from 'react-router-dom';
import type { ButtonType, Children } from '~/types';
import styles from './SultenButton.module.scss';

type ButtonProps = {
  link?: string;
  name?: string;
  type?: ButtonType;
  className?: string;
  disabled?: boolean;
  children?: Children;
  onClick?: () => void;
};

export function SultenButton({ name, type, onClick, disabled, className, children, link }: ButtonProps) {
  const classNames = classnames(styles.button, className, styles.button_basic);
  return link ? (
    <Link to={link} type={type} className={classNames}>
      {children}
    </Link>
  ) : (
    <button name={name} onClick={onClick} type={type} disabled={disabled} className={classNames}>
      {children}
    </button>
  );
}
