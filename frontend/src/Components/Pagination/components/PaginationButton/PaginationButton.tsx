import classNames from 'classnames';
import type { ReactNode } from 'react';
import type { ButtonProps } from '~/Components';
import { Button } from '~/Components/Button';
import styles from './PaginationButton.module.scss';

type PaginationButtonProps = Omit<ButtonProps, 'theme' | 'display'> & {
  isActive?: boolean;
  buttonSymbol: string | ReactNode;
};

export function PaginationButton({
  isActive,
  className,
  buttonSymbol,
  disabled,
  onClick,
  ...props
}: PaginationButtonProps) {
  return (
    <Button
      theme={isActive ? 'basic' : 'samf'}
      display={'basic'}
      rounded={false}
      onClick={onClick}
      disabled={disabled}
      className={classNames(styles.control, className)}
      {...props}
    >
      {buttonSymbol}
    </Button>
  );
}
