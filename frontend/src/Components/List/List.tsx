type ListProps = {
  items: Array<string>;
  ordered?: boolean;
};

export function List({ items, ordered }: ListProps) {
  if (ordered) {
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
