import type { ReservationTableDto } from '~/dto';
import styles from './Reservation.module.scss';

import classNames from 'classnames';
import { useState } from 'react';

type ReservationProps = {
  reservation: ReservationTableDto;
};

export function Reservation({ reservation }: ReservationProps) {
  const [hover, setHover] = useState<boolean>(false);
  return (
    <button
      type="button"
      className={styles.reservationContainer}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => alert('add edit reservation')}
    >
      <p className={styles.reservationName}>{reservation.name}</p>
      <div className={classNames(styles.moreInfo, !hover && styles.hidden)}>
        <p>{reservation.start_time}</p>
        <p>{reservation.end_time}</p>
      </div>
    </button>
  );
}
