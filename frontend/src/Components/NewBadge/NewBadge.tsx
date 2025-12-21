import classNames from 'classnames';
import type { HTMLAttributes, PropsWithChildren } from 'react';
import styles from './NewBadge.module.scss';

export type BadgeTheme = 'red' | 'purple' | 'green' | 'blue' | 'gold' | 'gray' | 'outline' | 'outline-white';

type Props = {
  theme: BadgeTheme;
} & PropsWithChildren &
  HTMLAttributes<HTMLDivElement>;

const classMap: Record<BadgeTheme, string> = {
  red: styles.red,
  purple: styles.purple,
  green: styles.green,
  blue: styles.blue,
  gold: styles.gold,
  gray: styles.gray,
  outline: styles.outline,
  'outline-white': styles.outline_white,
};

export function NewBadge({ theme, className, ...props }: Props) {
  return <div className={classNames(styles.badge, classMap[theme], className)} {...props} />;
}
