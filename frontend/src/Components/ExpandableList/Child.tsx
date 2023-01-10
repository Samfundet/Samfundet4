import { Children } from '~/types';
import styles from './ExpandableList.module.scss';
import classNames from 'classnames';

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
