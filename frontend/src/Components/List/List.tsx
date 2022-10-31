import classnames from 'classnames';
import styles from './List.module.scss';

type ListType = 'ordered' | 'unordered' | 'no_bullets';

type ListProps = {
  items: Array<JSX.Element>;
  type: ListType;
  classNameList?: string;
  classNameListEntries?: string;
};

export function List({ items, type = 'unordered', classNameList, classNameListEntries }: ListProps) {
  function MakeList(element: JSX.Element, index: number) {
    return (
      <li key={index} className={classNameListEntries}>
        {element}
      </li>
    );
  }
  if (type === 'ordered') {
    return <ol className={classNameList}>{items?.map((element, index) => MakeList(element, index))}</ol>;
  } else if (type === 'no_bullets') {
    const classNames = classnames(styles.list_no_bullets, classNameList);
    return <ul className={classNames}>{items?.map((element, index) => MakeList(element, index))}</ul>;
  } else {
    return <ul className={classNameList}>{items?.map((element, index) => MakeList(element, index))}</ul>;
  }
}
