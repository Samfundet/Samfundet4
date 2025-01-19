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
  onClose?: () => void;
};

export function Alert({
  message,
  type = 'info',
  title,
  className,
  closable = false,
  onClose,
  align = 'left',
}: AlertProps) {
  const [closed, setClosed] = useState(false);
  const wrapperClassNames = classnames(styles[type], className, styles.alert, align === 'right' && styles.rightWrapper);
  const contentClassName = classnames(styles[align], align === 'center' && closable ? styles.offset : undefined);
  return (
    <>
      {!closed && (
        <div className={wrapperClassNames}>
          <div className={contentClassName}>
            {title && <p className={styles.title}>{title}</p>}
            <p className={styles.content}>{message}</p>
          </div>
          {closable && (
            <Button
              className={styles.closeButton}
              onClick={() => {
                setClosed(true);
                onClose?.();
              }}
            >
              x
            </Button>
          )}
        </div>
      )}
    </>
  );
}
