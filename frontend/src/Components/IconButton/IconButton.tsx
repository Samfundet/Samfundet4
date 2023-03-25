import { Icon } from '@iconify/react';
import classNames from 'classnames';
import styles from './IconButton.module.scss';

type IconButtonProps = {
  onClick: () => void;
  color: string;
  title: string;
  icon: string;
  className?: string;
};

export function IconButton({ onClick, className, color, icon, title }: IconButtonProps) {
  function handleOnClick(e?: React.MouseEvent<HTMLElement>) {
    e?.preventDefault();
    onClick?.();
  }

  return (
    <button
      onClick={handleOnClick}
      title={title}
      translate="yes"
      className={classNames(styles.icon_button, className)}
      style={{ backgroundColor: color }}
    >
      <Icon icon={icon} />
    </button>
  );
}
