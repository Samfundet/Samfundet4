import { useTranslation } from 'react-i18next';
import { TimeDisplay, Button, Link } from '~/Components';
import { KEY } from '~/i18n/constants';
import styles from './ImageCard.module.scss';

type ImageCardProps = {
  className?: string;
};

export function ImageCard({ className }: ImageCardProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.top_label}>
        <div>Et arrangement</div>
        <div className={styles.date_label}>3 / 4</div>
      </div>
      <div className={styles.card}></div>
      <div className={styles.bottom_label}>
        <div>Et arrangement</div>
        <div className={styles.date_label}>3 / 4</div>
      </div>
      <div className={styles.bottom_description}>
        Lorem ipsum dolor sit amet, lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet
      </div>
    </div>
  );
}
