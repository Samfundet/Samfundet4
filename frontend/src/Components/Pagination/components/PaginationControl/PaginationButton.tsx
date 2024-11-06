import classNames from 'classnames';
import type { ReactNode } from 'react';
import { Button } from '~/Components/Button';
import styles from './PaginationButton.module.scss';

type PaginationButtonProps = {
  isActive?: boolean;
  className?: string;
  controlSymbol: string | ReactNode;
  disabled?: boolean;
  onClick?: () => void;
};

export function PaginationButton({
  isActive,
  className,
  controlSymbol,
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
      {controlSymbol}
    </Button>
  );
}
