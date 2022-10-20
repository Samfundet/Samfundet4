type ListType = 'ordered' | 'unordered';

type ListProps = {
  items: Array<string>;
  type: ListType;
};

export function List({ items, type = 'unordered' }: ListProps) {
  if (type === 'ordered') {
    return (
      <ol>
        {items.map(function (element, index) {
          return <li key={index}>{element}</li>;
        })}
      </ol>
    );
  } else {
    return (
      <ul>
        {items.map(function (element, index) {
          return <li key={index}>{element}</li>;
        })}
      </ul>
    );
  }
}
