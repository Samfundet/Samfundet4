import classNames from 'classnames';
import { Children } from '~/types';
import styles from './ProgressBar.module.scss';

type ProgressBarProps = {
  className?: string;
  children?: Children;
  value?: number;
  max?: number;
  fullWidth: boolean;
};

export function ProgressBar({ className, children, value, max, fullWidth = true }: ProgressBarProps) {
  // Breakpoints:
  const bpLower = 0.33;
  const bpUpper = 0.67;

  const ratio = value && max ? value / max : undefined;

  // Progress states:
  const isLow = ratio && ratio < bpLower;
  const isMedium = ratio && bpLower <= ratio && ratio <= bpUpper;
  const isHigh = ratio && bpUpper < ratio;
  const isLoading = !isLow && !isMedium && !isHigh;

  return (
    <label>
      {children}
      <progress
        className={classNames(className, styles.red, styles.progress_bar, {
          [styles.red]: isLow,
          [styles.orange]: isMedium,
          [styles.green]: isHigh,
          [styles.blue]: isLoading,
          [styles.full_width]: fullWidth,
        })}
        value={value}
        max={max}
      >
        {value}
      </progress>
    </label>
  );
}
