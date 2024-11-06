import classNames from 'classnames';
import type { ReactNode } from 'react';
import { Button, type ButtonDisplay, type ButtonTheme } from '~/Components/Button';
import type { ButtonType } from '~/types';
import styles from './PaginationControll.module.scss';

type PaginationControllProps = {
  isActive?: boolean;
  className?: string;
  controllText: string | ReactNode;
  theme?: ButtonTheme;
  display?: ButtonDisplay;
  type?: ButtonType;
  rounded?: boolean;
  link?: string;
  disabled?: boolean;
  tabIndex?: number;
  preventDefault?: boolean;
  onClick?: () => void;
  title?: string;
};

export function PaginationControll({
  isActive,
  className,
  controllText,
  theme = 'basic',
  display = 'basic',
  rounded = false,
  disabled,
  onClick,
  ...props
}: PaginationControllProps) {
  return (
    <Button
      theme={isActive ? 'basic' : theme}
      display={display}
      rounded={rounded}
      onClick={onClick}
      disabled={disabled}
      className={classNames(styles.control, className)}
      {...props}
    >
      {controllText}
    </Button>
  );
}
