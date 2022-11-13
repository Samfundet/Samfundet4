import classnames from 'classnames';
import { useState } from 'react';
import styles from './Alert.module.scss';

type AlertProps = {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error' | 'samf';
  title?: string;
  className?: 'string';
  closable?: boolean;
};

export function Alert({ message, type = 'info', title, className, closable = false }: AlertProps) {
  const [closed, setClosed] = useState(false);
  const classNames = classnames(styles[type], className, styles.alert);
  return (
    <>
      {!closed && (
        <div className={classNames}>
          <div>
            <p className={styles.title}>{title}</p>
            <p>{message}</p>
          </div>
          {closable && (
            <p className={styles.closeButton} onClick={() => setClosed(true)}>
              x
            </p>
          )}
        </div>
      )}
    </>
  );
}
