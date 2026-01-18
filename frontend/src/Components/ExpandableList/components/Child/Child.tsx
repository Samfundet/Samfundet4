import classNames from 'classnames';
import type { ReactNode } from 'react';
import styles from './Child.module.scss';

type ChildProps = {
  children: ReactNode;
};

export function Child({ children }: ChildProps) {
  return (
    <>
      <div className={classNames(styles.item, styles.child)}>{children}</div>
    </>
  );
}
