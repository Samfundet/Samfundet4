import { default as classNames, default as classnames } from 'classnames';
import { ButtonType, Children } from '~/types';
import styles from './Button.module.scss';
import { Link } from 'react-router-dom';

type ButtonTheme =
  | 'basic'
  | 'samf'
  | 'secondary'
  | 'success'
  | 'outlined'
  | 'blue'
  | 'black'
  | 'white'
  | 'green'
  | 'pure';
type ButtonDisplay = 'basic' | 'pill' | 'block';

type ButtonProps = {
  name?: string;
  theme?: ButtonTheme;
  display?: ButtonDisplay;
  type?: ButtonType;
  rounded?: boolean;
  link?: string;
  className?: string;
  disabled?: boolean;
  children?: Children;
  preventDefault?: boolean;
  onClick?: () => void;
};

const mapThemeToStyle: { [theme in ButtonTheme]: string } = {
  basic: styles.button_basic,
  pure: styles.pure,
  samf: styles.button_samf,
  secondary: styles.button_secondary,
  success: styles.button_success,
  outlined: classNames(styles.button_outlined, 'button_outlined'), // Must be globally available for theme-dark.
  blue: styles.button_blue,
  black: styles.button_black,
  white: styles.button_white,
  green: styles.button_green,
};

const mapDisplayToStyle: { [display in ButtonDisplay]: string } = {
  basic: styles.display_basic,
  pill: styles.display_pill,
  block: styles.display_block,
};

export function Button({
  name,
  theme = 'basic',
  display = 'basic',
  rounded = false,
  link,
  onClick,
  disabled,
  className,
  children,
  preventDefault = false,
}: ButtonProps) {
  const isPure = theme === 'pure';

  const classNames = classnames(
    !isPure && styles.button,
    mapThemeToStyle[theme],
    !isPure && mapDisplayToStyle[display],
    rounded && styles.rounded,
    className,
  );

  function handleOnClick(e?: React.MouseEvent<HTMLElement>) {
    if (preventDefault) {
      e?.preventDefault();
    }
    onClick?.();
  }

  return (
    <>
      {link ? (
        <Link to={link} onClick={handleOnClick} className={classNames}>
          {children}
        </Link>
      ) : (
        <button name={name} onClick={handleOnClick} disabled={disabled} className={classNames}>
          {children}
        </button>
      )}
    </>
  );
}
