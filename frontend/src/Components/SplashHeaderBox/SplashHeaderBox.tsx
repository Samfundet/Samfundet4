import { Icon } from '@iconify/react';
import classnames from 'classnames';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { useScreenCenterOffset } from '~/hooks';
import { KEY } from '~/i18n/constants';
import styles from './SplashHeaderBox.module.scss';

type SplashHeaderBoxProps = {
  className?: string;
};

export function SplashHeaderBox({ className }: SplashHeaderBoxProps) {
  const { t } = useTranslation();

  const id = useId();
  const scrollY = useScreenCenterOffset(id);

  const containerScrollSpeed = 0.05;
  const containerTranslation = scrollY * containerScrollSpeed;
  const containerTransform = `translateY(${containerTranslation}px)`;

  return (
    <div className={classnames(styles.container, className)} style={{ transform: containerTransform }} id={id}>
      <div className={classnames(styles.box, styles.box_left)}>
        <h2 className={styles.title_left}>
          <Icon icon="bx:party" />
          {t(KEY.common_whatsup)}
        </h2>
        <p>10:13 - Some weird event</p>
        <p>10:13 - Some weird event</p>
        <p>10:13 - Some weird event</p>
        <p>10:13 - Some weird event</p>
        <p>10:13 - Some weird event</p>
      </div>
      <div className={classnames(styles.box, styles.box_right)}>
        <h2 className={styles.title_right}>
          <Icon icon="material-symbols:calendar-month-rounded" />
          {t(KEY.common_opening_hours)}
        </h2>
        <p>10:13 - Some weird event</p>
        <p>10:13 - Some weird event</p>
        <p>10:13 - Some weird event</p>
        <p>10:13 - Some weird event</p>
        <p>10:13 - Some weird event</p>
      </div>
    </div>
  );
}
