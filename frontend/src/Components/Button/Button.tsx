import classnames from 'classnames';
import { ButtonType, Children } from '~/types';
import styles from './Button.module.scss';

type ButtonTheme = 'basic' | 'samf' | 'secondary';

type ButtonProps = {
  name?: string;
  theme?: ButtonTheme;
  type?: ButtonType;
  className?: string;
  disabled?: boolean;
  children?: Children;
  onClick?: () => void;
};

const mapThemeToStyle: { [theme in ButtonTheme]: string } = {
  basic: styles.button_basic,
  samf: styles.button_samf,
  secondary: styles.button_secondary,
};

export function Button({ name, type, theme = 'basic', onClick, disabled, className, children }: ButtonProps) {
  const classNames = classnames(styles.button, mapThemeToStyle[theme], className);
  return (
    <button name={name} onClick={onClick} type={type} disabled={disabled} className={classNames}>
      {children}
    </button>
  );
}
