import styles from './List.module.scss';

type ListType = 'ordered' | 'unordered' | 'no_bullets';

type ListProps = {
  items: Array<string>;
  type: ListType;
};

export function List({ items, type = 'unordered' }: ListProps) {
  function MakeList(element: string, index: number) {
    return <li key={index}>{element}</li>;
  }
  if (type === 'ordered') {
    return <ol>{items.map((element, index) => MakeList(element, index))}</ol>;
  } else if (type === 'no_bullets') {
    return <ul className={styles.list_no_bullets}>{items.map((element, index) => MakeList(element, index))}</ul>;
  } else {
    return <ul>{items.map((element, index) => MakeList(element, index))}</ul>;
  }
}
