import classNames from 'classnames';
import { t } from 'i18next';
import type { ReactNode } from 'react';
import { Skeleton } from '~/Components';
import { KEY } from '~/i18n/constants';
import type { Children } from '~/types';
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
  ticket_type?: string;
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
  ticket_type,
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

  let displayTicketType = '';
  if (ticket_type === 'billig' || ticket_type === 'custom') {
    displayTicketType = t(KEY.common_ticket_type_billig);
  }
  if (ticket_type === 'free' || ticket_type === 'registration') {
    displayTicketType = t(KEY.common_ticket_type_free);
  }
  if (ticket_type === 'included') {
    displayTicketType = t(KEY.common_ticket_type_included);
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
              <div className={styles.ticket_type}>{displayTicketType}</div>
            </div>

            <div className={bottomDescriptionStyle}>{description}</div>
          </div>
        </div>
      </Link>
    </div>
  );
}
