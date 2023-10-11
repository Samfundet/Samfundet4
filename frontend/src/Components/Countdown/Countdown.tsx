import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { Children } from '~/types';
import styles from './Countdown.module.scss';

interface CountdownProps {
  targetDate: Date;
  children?: Children;
}

export function Countdown({ targetDate, children }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isTimeOut, setIsTimeOut] = useState<boolean>(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        if (days > 0) return `${days}d ${hours}h`;
        if (difference < 10 * 60 * 1000) return `${minutes}m ${seconds}s`;
        return `${hours}h ${minutes}m`;
      } else {
        setIsTimeOut(true);
        return '0m 0s';
      }
    };

    const updateTimer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(updateTimer);
  }, [targetDate]);

  // If time is out, return the children.
  if (isTimeOut) return <>{children}</>;

  return (
    <div className={classNames(styles.countdown)}>
      <>
        <div className={styles.countdown_time}>{timeLeft}</div>
        <div className={styles.countdown_blur}>{children}</div>
      </>
    </div>
  );
}
