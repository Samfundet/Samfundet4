import { useTranslation } from 'react-i18next';
import { SultenDayDto } from '~/dto';
import styles from './ReservationTable.module.scss';
import { KEY } from '~/i18n/constants';
import { Icon } from '@iconify/react';
import { Button } from '~/Components';

type ReservationTableProps = {
  // The event being edited
  sultenDay: SultenDayDto;
  iterateDay: (days: number) => void;
  goToToday: () => void;
};

export function ReservationTable({ sultenDay, iterateDay, goToToday }: ReservationTableProps) {
  const { t } = useTranslation();

  return (
    <div>
      <div className={styles.tableHeader}>
        <div className={styles.dateIterator}>
          <div className={styles.iterateButton} onClick={() => iterateDay(-1)}>
            <Icon icon="fe:arrow-left" width={32} />
          </div>
          <div className={styles.date}>
            <p>{sultenDay.date.toDateString()}</p>
            <Icon icon="mdi:calendar" width={24} />
          </div>
          <div className={styles.iterateButton} onClick={() => iterateDay(1)}>
            <Icon icon="fe:arrow-right" width={32} />
          </div>
        </div>
        <div className={styles.buttonsHeader}>
          {new Date().getDate() != sultenDay.date.getDate() && (
            <Button theme="secondary" onClick={() => goToToday()}>
              {t(KEY.common_today)}
            </Button>
          )}
          <Button theme="green" onClick={() => alert('TODO add reservation form')}>
            {t(KEY.common_create)} {t(KEY.common_reservations)}
          </Button>
        </div>
      </div>
    </div>
  );
}
