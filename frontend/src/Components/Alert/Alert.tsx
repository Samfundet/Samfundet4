import classnames from 'classnames';
import { useState } from 'react';
import { Button } from '../Button';
import styles from './Alert.module.scss';

type AlertProps = {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error' | 'samf';
  title?: string;
  className?: 'string';
  closable?: boolean;
  align?: 'center' | 'left' | 'right';
};

export function Alert({ message, type = 'info', title, className, closable = false, align = 'left' }: AlertProps) {
  const [closed, setClosed] = useState(false);
  const classNames = classnames(styles[type], className, styles.alert, align === 'right' && styles.rightWrapper);
  return (
    <>
      {!closed && (
        <div className={classNames}>
          {closable && align === 'center' && <div className={styles.offset} />}
          <div className={styles[align]}>
            {title && <p className={styles.title}>{title}</p>}
            <p>{message}</p>
          </div>
          {closable && (
            <Button className={styles.closeButton} onClick={() => setClosed(true)}>
              x
            </Button>
          )}
        </div>
      )}
    </>
  );
}
