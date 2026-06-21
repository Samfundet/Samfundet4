import classNames from 'classnames';
import type { HTMLAttributes } from 'react';
import styles from './EventCardBanner.module.scss';

type EventCardBannerTheme = 'red' | 'gray';

type EventCardBannerProps = HTMLAttributes<HTMLDivElement> & {
  theme: EventCardBannerTheme;
};

export function EventCardBanner({ theme = 'red', children, ...props }: EventCardBannerProps) {
  const themeMap: Record<EventCardBannerTheme, string> = {
    gray: styles.gray,
    red: styles.red,
  };

  return (
    <div className={classNames(styles.banner, themeMap[theme])} {...props}>
      <div>{children}</div>
    </div>
  );
}
