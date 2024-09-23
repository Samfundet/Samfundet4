import type { DropDownOption } from '../Dropdown/Dropdown';

export function searchFilter<T>(item: DropDownOption<T>, q: string): boolean {
  return item.label.toLowerCase().includes(q.toLowerCase());
}

export function exists<T>(item: DropDownOption<T>, items: DropDownOption<T>[]): boolean {
  return items.some((_item) => _item.value === item.value);
}
