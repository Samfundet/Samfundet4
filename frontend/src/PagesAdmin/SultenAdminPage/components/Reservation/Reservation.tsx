import { ReservationTableDto } from '~/dto';
import styles from './Reservation.module.scss';

import { useState } from 'react';
import classNames from 'classnames';

type ReservationProps = {
  // The event being edited
  reservation: ReservationTableDto;
};

export function Reservation({ reservation }: ReservationProps) {
  const [hover, setHover] = useState<boolean>(false);
  return (
    <div
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
    </div>
  );
}
