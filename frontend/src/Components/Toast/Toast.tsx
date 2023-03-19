import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { Button } from '~/Components/Button';
import { ProgressBar } from '~/Components/ProgressBar';
import { positionToStyle } from '~/Components/Toast/utils';
import { useTimePassed } from '~/hooks';
import { Children, COLORS } from '~/types';
import styles from './Toast.module.scss';

/**
 * top-left       top-center      top-right
 * middle-left  middle-center  middle-right
 * bottom-left  bottom-center  bottom-right
 */
export const POSITIONS = [
  'top-left',
  'top-center',
  'top-right',
  'middle-left',
  'middle-center',
  'middle-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
] as const;
export type Position = typeof POSITIONS[number];

type ToastProps = {
  title?: string;
  message?: Children;
  position: Position;
  className?: string;
  closable: boolean;
  delay: number;
  onUndo?: () => void;
  onAccept?: () => void;
  onClose?: () => void;
};

export function Toast({
  title,
  message,
  position = 'top-right',
  className,
  closable = true,
  delay = 10000,
  onUndo,
  onAccept,
}: ToastProps) {
  const { timePassed } = useTimePassed(100);
  const [visible, setVisible] = useState(true);
  const timeLeft = delay - timePassed;
  const isTimeLeft = timeLeft > 0;

  useEffect(() => {
    if (!isTimeLeft) {
      setVisible(false);
    }
  }, [isTimeLeft]);

  const style = positionToStyle(position);

  if (!visible) return <></>;

  return (
    <div style={style} className={styles.flexParent}>
      <div className={classNames(className, styles.toast)}>
        <div className={styles.inner}>
          {closable && (
            <button className={styles.btn_close} onClick={() => setVisible(false)}>
              ⓧ
            </button>
          )}

          <h1 className={styles.title}>{title}</h1>
          <p className={styles.message}>{message}</p>

          <div className={styles.btn_bar}>
            <Button className={styles.btn_undo} theme="outlined" onClick={onUndo}>
              undo
            </Button>
            <Button className={styles.btn_accept} theme="outlined" onClick={onAccept}>
              accept
            </Button>
          </div>

          <ProgressBar value={timeLeft} max={delay} color={COLORS.turquoise_medium} />
        </div>
      </div>
    </div>
  );
}
