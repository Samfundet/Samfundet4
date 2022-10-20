import { Children } from '../../types';

type ListProps = {
  //   id: string;
  //   name?: string;
  //   value?: string;
  //   checked?: boolean;
  //   className?: string;
  //   disabled?: boolean;
  children?: Children;
};

export function List({ children }: ListProps) {
  return (
    <div>
      {children}
      <ul>
        <li>Item</li>
      </ul>
    </div>
  );
}
