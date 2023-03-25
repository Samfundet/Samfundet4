import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { Button } from '~/Components/Button';
import { ProgressBar } from '~/Components/ProgressBar';
import { useTimePassed } from '~/hooks';
import { Children, COLORS } from '~/types';
import { useToastContext } from '../ToastManager/ToastManager';
import styles from './Toast.module.scss';

export type ToastProps = {
  id?: number;
  title?: string;
  message?: Children;
  className?: string;
  closable: boolean;
  delay: number;
  onUndo?: () => void;
  onAccept?: () => void;
  onClose?: () => void;
};

export function Toast({
  id = -1,
  title,
  message,
  className,
  closable = true,
  delay = 10000,
  onUndo,
  onAccept,
}: ToastProps) {
  const { timePassed } = useTimePassed(500);
  const [visible, setVisible] = useState(true);
  const timeLeft = delay - timePassed;
  const isTimeLeft = timeLeft > 0;
  const shouldPop = timeLeft < -1000; // 1s animation before pop

  const { pushToast, popToast } = useToastContext();

  useEffect(() => {
    if (!isTimeLeft && visible) {
      setVisible(false);
    }
    if (shouldPop) {
      popToast(id);
    }
  }, [id, popToast, isTimeLeft, visible, shouldPop]);

  return (
    <div className={classNames(className, styles.toast, !visible && styles.toast_hidden)}>
      <div className={styles.inner}>
        {closable && (
          <button className={styles.btn_close} onClick={() => setVisible(false)}>
            <Icon icon="mdi:close" />
          </button>
        )}

        <h1 className={styles.title}>{title}</h1>
        <p className={styles.message}>{message}</p>

        <div className={styles.btn_bar}>
          {onUndo !== undefined && (
            <Button theme="white" rounded={true} onClick={onUndo}>
              Undo
            </Button>
          )}
          {onAccept !== undefined && (
            <Button theme="green" rounded={true} onClick={onAccept}>
              Accept
            </Button>
          )}
        </div>

        <ProgressBar value={timeLeft} max={delay} color={COLORS.red_samf} />
      </div>
    </div>
  );
}
