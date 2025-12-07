import classNames from 'classnames';
import type { HTMLAttributes, PropsWithChildren } from 'react';
import styles from './NewBadge.module.scss';

export type BadgeTheme = 'red' | 'purple' | 'green' | 'gold' | 'gray' | 'outline';

type Props = {
  theme: BadgeTheme;
} & PropsWithChildren & HTMLAttributes<HTMLDivElement>;

const classMap: Record<BadgeTheme, string> = {
  red: styles.red,
  purple: styles.purple,
  green: styles.green,
  gold: styles.gold,
  gray: styles.gray,
  outline: styles.outline,
};

export function NewBadge({ theme, className, ...props }: Props) {
  return <div className={classNames(styles.badge, classMap[theme], className)} {...props} />;
}
