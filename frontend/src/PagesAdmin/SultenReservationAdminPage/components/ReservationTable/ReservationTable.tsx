import { useTranslation } from 'react-i18next';
import type { SultenReservationDayDto } from '~/dto';
import styles from './ReservationTable.module.scss';
import { KEY } from '~/i18n/constants';
import { Icon } from '@iconify/react';
import { Button } from '~/Components';
import { useEffect, useState } from 'react';
import { ReservationTableRow } from '../ReservationTableRow';

type ReservationTableProps = {
  sultenDay: SultenReservationDayDto;
  iterateDay: (days: number) => void;
  goToToday: () => void;
};

export function ReservationTable({ sultenDay, iterateDay, goToToday }: ReservationTableProps) {
  const { t } = useTranslation();
  const [hours, setHours] = useState<string[]>([]);

  const today = new Date();

  useEffect(() => {
    let hours_iterator = Number.parseInt(sultenDay.start_time.split(':')[0]) + 1;
    const hours_end = Number.parseInt(sultenDay.closing_time.split(':')[0]) + 1;

    const hoursList: string[] = [];

    while (hours_iterator < hours_end) {
      hoursList.push(`${hours_iterator.toString().padStart(2, '0')}:00`);
      hours_iterator += 1;
    }
    setHours(hoursList);
  }, [sultenDay]);

  const hoursHeader = (
    <div className={styles.timeHeader}>
      <div className={styles.table}>
        <p className={styles.tableText}>{t(KEY.common_table)}</p>
      </div>
      {hours.map((hour) => (
        <div className={styles.time} key={hour}>
          <p className={styles.timeText}>{hour}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <div className={styles.tableHeader}>
        <div className={styles.dateIterator}>
          <button type="button" className={styles.iterateButton} onClick={() => iterateDay(-1)}>
            <Icon icon="fe:arrow-left" width={32} />
          </button>
          <div className={styles.date}>
            <p>{sultenDay.date.toDateString()}</p>
            <Icon icon="mdi:calendar" width={24} />
          </div>
          <button type="button" className={styles.iterateButton} onClick={() => iterateDay(1)}>
            <Icon icon="fe:arrow-right" width={32} />
          </button>
        </div>
        <div className={styles.buttonsHeader}>
          {today.getDate() !== sultenDay.date.getDate() && (
            <Button theme="secondary" onClick={() => goToToday()}>
              {t(KEY.common_today)}
            </Button>
          )}
          <Button theme="green" onClick={() => alert('TODO add reservation form')}>
            {t(KEY.common_create)} {t(KEY.common_reservation)}
          </Button>
        </div>
      </div>
      {hoursHeader}
      {sultenDay.tables?.map((table) => {
        return (
          <ReservationTableRow
            key={table.id}
            table={table}
            start_time={sultenDay.start_time}
            end_time={sultenDay.closing_time}
          />
        );
      })}
    </div>
  );
}
