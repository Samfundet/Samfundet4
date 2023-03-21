import classnames from 'classnames';
import { backgroundImageFromUrl } from '~/utils';
import { Link } from '../Link';
import { TimeDisplay } from '../TimeDisplay';
import styles from './ImageCard.module.scss';

type ImageCardProps = {
  className?: string;
  title?: string;
  date?: string | Date;
  url?: string;
  imageUrl?: string;
  compact?: boolean;
};

export function ImageCard({ className, title, date, url, imageUrl, compact }: ImageCardProps) {
  return (
    <div className={classnames(styles.container, compact && styles.compact, className)}>
      {url && <Link url={url} className={styles.card} style={backgroundImageFromUrl(imageUrl)} />}
      {!url && <div className={styles.card} style={backgroundImageFromUrl(imageUrl)} />}

      <div className={styles.bottom_label}>
        <div>{title}</div>
        <div className={styles.date_label}>{date && <TimeDisplay timestamp={date} displayType="event" />}</div>
      </div>
      <div className={styles.bottom_description}>
        Lorem ipsum dolor sit amet, lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet
      </div>
    </div>
  );
}
