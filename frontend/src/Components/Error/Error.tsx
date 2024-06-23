import type { Children } from '~/types';
import styles from './Error.module.scss';

interface ErrorProps {
  header: string;
  message: string;
  children?: Children;
}

export function Error({ header, message, children }: ErrorProps) {
  return (
    <div>
      <h1 className={styles.header}>{header}</h1>
      <div className={styles.error_content}>
        <p className={styles.message}>{message}</p>
        {children}
      </div>
    </div>
  );
}
