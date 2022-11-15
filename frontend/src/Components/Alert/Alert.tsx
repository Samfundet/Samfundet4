import classnames from 'classnames';
import { useState } from 'react';
import { AlertType } from '~/types';
import { Button } from '../Button';
import styles from './Alert.module.scss';

interface AlertProps extends AlertType {
  className?: 'string';
}

export function Alert({ message, type = 'info', title, className, closable = false, align = 'left' }: AlertProps) {
  const [closed, setClosed] = useState(false);
  const wrapperClassNames = classnames(styles[type], className, styles.alert, align === 'right' && styles.rightWrapper);
  const contentClassName = classnames(styles[align], align === 'center' && closable ? styles.offset : undefined);
  return (
    <>
      {!closed && (
        <div className={wrapperClassNames}>
          <div className={contentClassName}>
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
