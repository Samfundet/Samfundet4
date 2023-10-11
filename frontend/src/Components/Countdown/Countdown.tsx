import { useEffect, useState } from 'react';

import classNames from 'classnames';
import { Children } from '~/types';
import styles from './Countdown.module.scss';

type CountdownProps = {
  targetDate: Date;
  children?: Children;
};

const SECOND_MILLIS = 1000;
const MINUTE_MILLIS = 60 * SECOND_MILLIS;
const HOUR_MILLIS = 60 * MINUTE_MILLIS;
const DAY_MILLIS = 24 * HOUR_MILLIS;

/**
 * Calculates the time left until targetDate.
 */
const calculateTimeLeft = (targetDate: Date): [string, boolean] => {
  const now = new Date();
  const difference = targetDate.getTime() - now.getTime();

  if (difference > 0) {
    const days = Math.floor(difference / DAY_MILLIS);
    const hours = Math.floor((difference % DAY_MILLIS) / HOUR_MILLIS);
    const minutes = Math.floor((difference % HOUR_MILLIS) / MINUTE_MILLIS);
    const seconds = Math.floor((difference % MINUTE_MILLIS) / SECOND_MILLIS);

    if (days > 0) return [`${days}d ${hours}h`, false];
    if (difference < 60 * SECOND_MILLIS) return [`${seconds}s`, false];
    if (difference < 10 * MINUTE_MILLIS) return [`${minutes}m ${seconds}s`, false];
    if (difference < 60 * MINUTE_MILLIS) return [`${minutes}m`, false];
    return [`${hours}h ${minutes}m`, false];
  }

  return ['0m 0s', true];
};

export function Countdown({ targetDate, children }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isTimeOut, setIsTimeOut] = useState<boolean>(false);

  useEffect(() => {
    const updateTimer = setInterval(() => {
      const [newTimeLeft, newIsTimeOut] = calculateTimeLeft(targetDate);
      setTimeLeft(newTimeLeft);
      if (newIsTimeOut) setIsTimeOut(true);
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
