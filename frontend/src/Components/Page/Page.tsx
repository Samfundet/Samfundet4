import { Children } from '~/types';
import styles from './Page.module.scss';

type PageProps = {
  children?: Children;
};

/**
 * Page component for general styling of padding margin and such
 * Could be implemented with border art, and default values such as fonts
 */
export function Page({ children }: PageProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
