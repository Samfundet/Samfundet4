import classNames from 'classnames';
import type { PropsWithChildren } from 'react';
import styles from './NewBadge.module.scss';

export type BadgeTheme = 'red' | 'purple' | 'green' | 'gold' | 'gray' | 'outline';

type Props = {
  theme: BadgeTheme;
} & PropsWithChildren;

const classMap: Record<BadgeTheme, string> = {
  red: styles.red,
  purple: styles.purple,
  green: styles.green,
  gold: styles.gold,
  gray: styles.gray,
  outline: styles.outline,
};

export function NewBadge({ theme, ...props }: Props) {
  return <div className={classNames(styles.badge, classMap[theme])} {...props} />;
}
