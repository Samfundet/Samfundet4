import { TimeDisplay } from '../TimeDisplay';
import styles from './TimeDuration.module.scss';
type TimeDurationProps = {
  start: string;
  end: string;
  className?: string;
};

export function TimeDuration({ start, end, className }: TimeDurationProps) {
  return (
    <div className={styles.container}>
      <TimeDisplay className={className} timestamp={start} displayType="time" />
      <p>-</p>
      <TimeDisplay className={className} timestamp={end} displayType="time" />
    </div>
  );
}
