import classnames from 'classnames';
import { CSSProperties } from 'react';
import { Link } from '../Link';
import { TimeDisplay } from '../TimeDisplay';
import styles from './ImageCard.module.scss';

type ImageCardProps = {
  className?: string;
  title?: string;
  date?: string;
  url?: string;
  imageUrl?: string;
  compact?: boolean;
};

export function ImageCard({ className, title, date, url, imageUrl, compact }: ImageCardProps) {
  function imageUrlStyle(): CSSProperties {
    if (imageUrl != null) {
      return {
        // TODO this is not safe for production, need to use absolute path
        // We should probably setup better hosting system for dev to emulate prod better
        backgroundImage: `url("http://localhost:8000${imageUrl}")`,
      };
    }
    return {};
  }

  return (
    <div className={classnames(styles.container, compact && styles.compact, className)}>
      {url && <Link url={url} className={styles.card} style={imageUrlStyle()} />}
      {!url && <div className={styles.card} style={imageUrlStyle()} />}

      <div className={styles.bottom_label}>
        <div>{title}</div>
        <div className={styles.date_label}>{date && <TimeDisplay timestamp={date} displayType="date" />}</div>
      </div>
      <div className={styles.bottom_description}>
        Lorem ipsum dolor sit amet, lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet
      </div>
    </div>
  );
}
