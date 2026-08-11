import { default as classnames } from 'classnames';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import type { ButtonType } from '~/types';
import styles from './Button.module.scss';
import type { ButtonDisplay, ButtonTheme } from './types';
import { buttonStyles, buttonThemes } from './utils';

export type ButtonProps = {
  name?: string;
  theme?: ButtonTheme;
  display?: ButtonDisplay;
  type?: ButtonType;
  rounded?: boolean;
  link?: string;
  className?: string;
  disabled?: boolean;
  tabIndex?: number;
  children?: ReactNode;
  preventDefault?: boolean;
  onClick?: () => void;
  title?: string;
};

export function Button({
  name,
  theme = 'primary',
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
  const classNames = classnames(buttonThemes[theme], buttonStyles[display], rounded && styles.rounded, className);

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
