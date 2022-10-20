type ListType = 'ordered' | 'unordered';

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
  } else {
    return <ul>{items.map((element, index) => MakeList(element, index))}</ul>;
  }
}
