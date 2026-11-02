import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { Link } from '~/Components';
import type { LinkProps } from '~/Components/Link/Link';
import styles from './IconButton.module.scss';

export type IconButtonSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';

type IconButtonProps = {
  onClick?: () => void;
  url?: string;
  color?: string;
  title: string;
  icon: string;
  className?: string;
  border?: string;
  size?: IconButtonSize;
  avatarColor?: string;
} & Pick<LinkProps, 'target'>;

export function IconButton({
  onClick,
  className,
  color,
  icon,
  title,
  border,
  url,
  target,
  size = 'lg',
  avatarColor,
}: IconButtonProps) {
  function handleOnClick(e?: React.MouseEvent<HTMLElement>) {
    e?.preventDefault();
    e?.stopPropagation();
    onClick?.();
  }

  if (url) {
    return (
      <Link
        url={url}
        plain
        title={title}
        target={target}
        className={classNames(styles.icon_button, className, styles[size])}
        style={{ backgroundColor: color, border: border }}
      >
        <Icon icon={icon} color={avatarColor} />
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={handleOnClick}
      title={title}
      aria-label={title}
      className={classNames(styles.icon_button, className, styles[size])}
      style={{ backgroundColor: color, border: border }}
    >
      <Icon icon={icon} color={avatarColor} />
    </button>
  );
}
