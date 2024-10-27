import { H1 } from '~/Components';
import type { Children } from '~/types';
import styles from './Error.module.scss';

interface ErrorProps {
  header: string;
  message: string;
  children?: Children;
}

// biome-ignore lint/suspicious/noShadowRestrictedNames:
export function Error({ header, message, children }: ErrorProps) {
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
