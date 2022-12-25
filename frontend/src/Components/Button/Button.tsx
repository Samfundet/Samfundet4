import { default as classNames, default as classnames } from 'classnames';
import { ButtonType, Children } from '~/types';
import styles from './Button.module.scss';

type ButtonTheme = 'basic' | 'samf' | 'darksamf' | 'secondary' | 'success' | 'outlined' | 'blue';
type ButtonDisplay = 'basic' | 'pill' | 'block';

type ButtonProps = {
  name?: string;
  theme?: ButtonTheme;
  display?: ButtonDisplay;
  type?: ButtonType;
  className?: string;
  disabled?: boolean;
  children?: Children;
  onClick?: () => void;
};

const mapThemeToStyle: { [theme in ButtonTheme]: string } = {
  basic: styles.button_basic,
  samf: styles.button_samf,
  darksamf: styles.button_darksamf,
  secondary: styles.button_secondary,
  success: styles.button_success,
  outlined: classNames(styles.button_outlined, 'button_outlined'), // Must be globally available for theme-dark.
  blue: styles.button_blue,
};

const mapDisplayToStyle: { [display in ButtonDisplay]: string } = {
  basic: styles.display_basic,
  pill: styles.display_pill,
  block: styles.display_block,
};

export function Button({
  name,
  type,
  theme = 'basic',
  display = 'basic',
  onClick,
  disabled,
  className,
  children,
}: ButtonProps) {
  const classNames = classnames(styles.button, mapThemeToStyle[theme], mapDisplayToStyle[display], className);
  return (
    <button name={name} onClick={onClick} type={type} disabled={disabled} className={classNames}>
      {children}
    </button>
  );
}
