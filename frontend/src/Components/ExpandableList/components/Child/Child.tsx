import classNames from 'classnames';
import type { Children } from '~/types';
import styles from './Child.module.scss';

type ChildProps = {
  children: Children;
};

export function Child({ children }: ChildProps) {
  return (
    <>
      <div className={classNames(styles.item, styles.child)}>{children}</div>
    </>
  );
}
