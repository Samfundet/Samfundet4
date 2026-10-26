import type { ReactNode } from 'react';
import styles from './Category.module.scss';

type CategoryProps = {
  header: ReactNode;
  children?: ReactNode;
};

export function Category({ header, children }: CategoryProps) {
  return (
    <section className={styles.category}>
      <header className={styles.header}>{header}</header>
      <div className={styles.content}>{children}</div>
    </section>
  );
}
