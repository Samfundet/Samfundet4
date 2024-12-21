import type { DropdownOption } from '../Dropdown/Dropdown';

export function searchFilter<T>(item: DropdownOption<T>, q: string): boolean {
  return item.label.toLowerCase().includes(q.toLowerCase());
}

export function exists<T>(item: DropdownOption<T>, items: DropdownOption<T>[]): boolean {
  return items.some((_item) => _item.value === item.value);
}
