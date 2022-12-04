import { TimeDisplay } from '../TimeDisplay';
import styles from './TimeDuration.module.scss';
type TimeDurationProps = {
  start: string;
  end: string;
};

export function TimeDuration({ start, end }: TimeDurationProps) {
  return (
    <div className={styles.container}>
      <TimeDisplay timestamp={start} displayType="time" />
      <p>-</p>
      <TimeDisplay timestamp={end} displayType='time' />
    </div>
  );
}
