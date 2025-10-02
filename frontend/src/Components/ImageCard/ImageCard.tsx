import classNames from 'classnames';
import { t } from 'i18next';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Skeleton } from '~/Components';
import { useAuthContext } from '~/context/AuthContext';
import { KEY } from '~/i18n/constants';
import { EventTicketType } from '~/types';
import { backgroundImageFromUrl } from '~/utils';
import { Badge } from '../Badge';
import { Link } from '../Link';
import { TimeDisplay } from '../TimeDisplay';
import styles from './ImageCard.module.scss';

type ImageCardProps = {
  className?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  id?: number;
  date?: string | Date;
  url?: string;
  imageUrl?: string;
  localImage?: boolean; // Local image in frontend assets.
  compact?: boolean;
  isSkeleton?: boolean;
  children?: ReactNode;
  ticket_type?: string;
  host?: string;
};

export function ImageCard({
  className,
  title = <Skeleton width={'8em'} />,
  subtitle = <Skeleton width={'4em'} />,
  description = <Skeleton width={'100%'} />,
  date,
  id,
  url = '#',
  imageUrl,
  compact,
  isSkeleton,
  children,
  ticket_type,
  host,
}: ImageCardProps) {
  const containerStyle = classNames(styles.container, compact && styles.compact, className);
  const cardStyle = classNames(styles.card);
  const bottomDescriptionStyle = styles.bottom_description;

  const [displayTicketType, setTicketType] = useState('');
  const [showTicket, setShowTicket] = useState(false);
  const { user } = useAuthContext();
  const isStaff = user?.is_staff;

  useEffect(() => {
    if (ticket_type === EventTicketType.FREE || ticket_type === EventTicketType.REGISTRATION) {
      setTicketType(t(KEY.common_ticket_type_free));
      setShowTicket(true);
    } else {
      setTicketType('');
      setShowTicket(false);
    }
  }, [ticket_type]);

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
          <div className={styles.badges}>
            {isStaff && (
              <Link url={`/control-panel/events/edit/${id}`} className={styles.admin_edit_button}>
                Rediger
              </Link>
            )}
            <Badge className={styles.event_host} text={host} />
            {showTicket && <Badge text={displayTicketType} className={styles.ticket_type} />}
          </div>
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
