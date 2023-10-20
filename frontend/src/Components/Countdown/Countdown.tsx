import { useEffect, useState } from 'react';

import classNames from 'classnames';
import { SECOND_MILLIS } from '~/constants';
import { Children } from '~/types';
import styles from './Countdown.module.scss';
import { calculateTimeLeft, hasReachedTargetDate } from './utils';

type CountdownProps = {
  targetDate: Date;
  children?: Children;
};

export function Countdown({ targetDate, children }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isTimeOut, setIsTimeOut] = useState<boolean>(false);

  useEffect(() => {
    const updateTimer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(targetDate);
      setTimeLeft(newTimeLeft);
      if (hasReachedTargetDate(targetDate)) setIsTimeOut(true);
    }, SECOND_MILLIS);

    return () => clearInterval(updateTimer);
  }, [targetDate]);

  if (isTimeOut) return <>{children}</>;

  return (
    <div className={classNames(styles.countdown)}>
      <div className={styles.countdown_time}>{timeLeft}</div>
      <div className={styles.countdown_blur}>{children}</div>
    </div>
  );
}
