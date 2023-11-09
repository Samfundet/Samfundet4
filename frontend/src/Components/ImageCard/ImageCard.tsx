import classNames from 'classnames';
import { ReactNode } from 'react';
import { Skeleton } from '~/Components';
import { Children } from '~/types';
import { backgroundImageFromUrl } from '~/utils';
import { Link } from '../Link';
import { TimeDisplay } from '../TimeDisplay';
import styles from './ImageCard.module.scss';

type ImageCardProps = {
  className?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  date?: string | Date;
  url?: string;
  imageUrl?: string;
  localImage?: boolean; // Local image in frontend assets.
  compact?: boolean;
  isSkeleton?: boolean;
  children?: Children;
};

export function ImageCard({
  className,
  title = <Skeleton width={'8em'} />,
  subtitle = <Skeleton width={'4em'} />,
  description = <Skeleton width={'100%'} />,
  date,
  url = '#',
  imageUrl,
  compact,
  isSkeleton,
  children,
}: ImageCardProps) {
  const containerStyle = classNames(styles.container, compact && styles.compact, className);
  const cardStyle = classNames(styles.card);
  const bottomDescriptionStyle = styles.bottom_description;

  if (isSkeleton) {
    return (
      <div className={containerStyle}>
        <Skeleton className={cardStyle} borderRadius={'1em'} height={compact ? '7.3em' : '13em'} />
      </div>
    );
  }

  return (
    <div className={containerStyle}>
      <Link url={url} className={classNames(cardStyle, styles.image)} style={backgroundImageFromUrl(imageUrl)}>
        <div className={styles.card_inner}>
          <div>{children}</div>

          <div className={styles.card_content}>
            <div className={styles.title}>{title}</div>

            <div className={styles.subtitle}>
              {subtitle}
              <div className={styles.date_label}>
                {date && <TimeDisplay timestamp={date} displayType="event-datetime" />}
              </div>
            </div>

            <div className={bottomDescriptionStyle}>{description}</div>
          </div>
        </div>
      </Link>
    </div>
  );
}
