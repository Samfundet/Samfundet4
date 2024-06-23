import classnames from 'classnames';
import type { Children } from '~/types';
import styles from './List.module.scss';

type ListType = 'ordered' | 'unordered' | 'no_bullets';

type ListProps = {
  items: Array<Children>;
  type: ListType;
  classNameList?: string;
  classNameListEntries?: string;
};

export function List({ items, type = 'unordered', classNameList, classNameListEntries }: ListProps) {
  const listItems = (
    <>
      {items?.map((element, index) => (
        <li key={index} className={classNameListEntries}>
          {element}
        </li>
      ))}
    </>
  );

  if (type === 'ordered') {
    return <ol className={classNameList}>{listItems}</ol>;
  }

  if (type === 'unordered') {
    return <ul className={classNameList}>{listItems}</ul>;
  }

  const classNames = classnames(styles.list_no_bullets, classNameList);
  return <ul className={classNames}>{listItems}</ul>;
}
