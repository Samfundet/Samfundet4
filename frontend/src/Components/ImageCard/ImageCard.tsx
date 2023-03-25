import classnames from 'classnames';
import { backgroundImageFromUrl } from '~/utils';
import { Link } from '../Link';
import { TimeDisplay } from '../TimeDisplay';
import styles from './ImageCard.module.scss';

type ImageCardProps = {
  className?: string;
  title?: string;
  description?: string;
  date?: string | Date;
  url?: string;
  imageUrl?: string;
  localImage?: boolean; // Local image in frontend assets
  compact?: boolean;
};

export function ImageCard({
  className,
  title,
  description,
  date,
  url,
  imageUrl,
  localImage = false,
  compact,
}: ImageCardProps) {
  return (
    <div className={classnames(styles.container, compact && styles.compact, className)}>
      {url && <Link url={url} className={styles.card} style={backgroundImageFromUrl(imageUrl, localImage)} />}
      {!url && <div className={styles.card} style={backgroundImageFromUrl(imageUrl, localImage)} />}

      <div className={styles.bottom_label}>
        <div>{title}</div>
        <div className={styles.date_label}>{date && <TimeDisplay timestamp={date} displayType="event" />}</div>
      </div>
      <div className={styles.bottom_description}>
        {description}
        &nbsp;
      </div>
    </div>
  );
}
