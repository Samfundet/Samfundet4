import { Children } from '../../types';

type ListProps = {
  id: string;
  name?: string;
  value?: string;
  checked?: boolean;
  className?: string;
  disabled?: boolean;
  children?: Children;
};

export function List({ id, name, value, checked, disabled, className, children }: ListProps) {
  return (
    <ul>
      <li>Item</li>
    </ul>
  );
}
