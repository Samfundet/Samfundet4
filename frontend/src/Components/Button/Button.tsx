import { default as classnames } from 'classnames';
import { Link } from 'react-router-dom';
import { ButtonType, Children } from '~/types';
import styles from './Button.module.scss';
import { ButtonDisplay, ButtonTheme } from './types';
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
  link,
  onClick,
  disabled,
  className,
  children,
  preventDefault = false,
  ...props
}: ButtonProps) {
  const isPure = theme === 'pure';

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
        <button name={name} onClick={handleOnClick} disabled={disabled} className={classNames} {...props}>
          {children}
        </button>
      )}
    </>
  );
}
