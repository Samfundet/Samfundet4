import { Children } from '~/types';
import styles from './Page.module.scss';

type PageProps = {
  children?: Children;
};

export function Page({ children }: PageProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
