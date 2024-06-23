import { default as classnames } from 'classnames';
import { Link } from 'react-router-dom';
import type { ButtonType, Children } from '~/types';
import styles from './Button.module.scss';
import type { ButtonDisplay, ButtonTheme } from './types';
import { displayToStyleMap, themeToStyleMap } from './utils';

type ButtonProps = {
  name?: string;
  theme?: ButtonTheme;
  display?: ButtonDisplay;
  type?: ButtonType;
  rounded?: boolean;
  link?: string;
  className?: string;
  disabled?: boolean;
  tabIndex?: number;
  children?: Children;
  preventDefault?: boolean;
  onClick?: () => void;
};

export function Button({
  name,
  theme = 'basic',
  display = 'basic',
  rounded = false,
  type = 'button',
  link,
  onClick,
  disabled,
  className,
  children,
  preventDefault = false,
  ...props
}: ButtonProps) {
  const isPure = theme === 'pure' || theme == 'text';

  const classNames = classnames(
    !isPure && styles.button,
    themeToStyleMap[theme],
    !isPure && displayToStyleMap[display],
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
        <Link to={link} onClick={handleOnClick} className={classNames} {...props}>
          {children}
        </Link>
      ) : (
        <button name={name} onClick={handleOnClick} disabled={disabled} className={classNames} type={type} {...props}>
          {children}
        </button>
      )}
    </>
  );
}
