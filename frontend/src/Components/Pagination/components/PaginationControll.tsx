import { Button, type ButtonDisplay, type ButtonTheme } from '~/Components/Button';
import type { ButtonType } from '~/types';

type PaginationControllProps = {
  isActive?: boolean;
  className?: string;
  controllText: string;
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
      className={className}
      {...props}
    >
      {controllText}
    </Button>
  );
}
