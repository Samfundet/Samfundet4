import classnames from 'classnames';
import { useTranslation } from 'react-i18next';
import styles from './ImageCard.module.scss';

type ImageCardProps = {
  className?: string;
  compact?: boolean;
};

export function ImageCard({ className, compact }: ImageCardProps) {
  const { t } = useTranslation();

  return (
    <div className={classnames(styles.container, compact && styles.compact)}>
      <div className={styles.card}></div>
      <div className={styles.bottom_label}>
        <div>Et arrangement</div>
        <div className={styles.date_label}>3. januar</div>
      </div>
      <div className={styles.bottom_description}>
        Lorem ipsum dolor sit amet, lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet
      </div>
    </div>
  );
}
