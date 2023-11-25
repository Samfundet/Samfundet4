import { useEffect, useState } from 'react';
import { InputField } from '~/Components/InputField';
import { DropDownOption } from '../Dropdown/Dropdown';
import styles from './MultiSelect.module.scss';

type MultiSelectProps<T> = {
  className?: string;
  defaultValues?: DropDownOption<T>[];
  initialValues?: T[];
  options?: DropDownOption<T>[];
  error?: boolean;
  onChange?: (values: T[]) => void;
  label?: string;
};

export function MultiSelect<T>({ className, defaultValues, options, error, onChange, label }: MultiSelectProps<T>) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<DropDownOption<T>[]>(defaultValues ?? []);

  useEffect(() => {
    setSelected(defaultValues ?? []);
  }, [defaultValues]);

  // Log selected items
  useEffect(() => {
    console.log(`selected: ${selected}`);
  }, [selected]);

  function addItem(item: DropDownOption<T>) {
    const updatedSelected = [...selected, item];
    setSelected(updatedSelected);
    onChange?.(updatedSelected.map((item) => item.value));
  }

  function removeItem(removedItem: DropDownOption<T>) {
    const updatedSelected = selected.filter((item) => item !== removedItem);
    setSelected(updatedSelected);
    onChange?.(updatedSelected.map((item) => item.value));
  }

  function handleSelect(item: DropDownOption<T>) {
    if (selected.some((selectedItem) => selectedItem === item)) {
      removeItem(item);
    } else {
      addItem(item);
    }
  }

  const filteredOptions =
    query.length > 0 ? options?.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())) : [];

  return (
    <label>
      {label}
      <InputField<string> inputClassName={styles.inputClass} placeholder={'Search...'} onChange={(e) => setQuery(e)} />
      <div className={styles.userList}>
        {filteredOptions?.map((item) => (
          <button className={styles.userItem} onClick={() => handleSelect(item)} key={item.label}>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      {selected &&
        selected.map((item) => (
          <div className={styles.selectedItem} key={item.label}>
            <span>{item.label}</span>
            <button onClick={() => removeItem(item)}>X</button>
          </div>
        ))}
    </label>
  );
}
