import type { ReactNode } from 'react';
import { H1 } from '~/Components';
import styles from './ErrorDisplay.module.scss';

interface ErrorDisplayProps {
  header: string;
  message: string;
  children?: ReactNode;
}

export function ErrorDisplay({ header, message, children }: ErrorDisplayProps) {
  return (
    <div>
      <H1>{header}</H1>
      <div className={styles.error_content}>
        <p className={styles.message}>{message}</p>
        {children}
      </div>
    </div>
  );
}
