import { useMemo, useState } from 'react';
import { InputField } from '~/Components/InputField';
import { ButtonType } from '~/types';
import { Button } from '../Button';
import { DropDownOption } from '../Dropdown/Dropdown';
import styles from './MultiSelect.module.scss';
import { exists, searchFilter } from './utils';

export type MultiSelectProps<T> = {
  label?: string;
  optionsLabel?: string;
  selectedLabel?: string;
  selectAllBtnTxt?: string;
  unselectAllBtnTxt?: string;
  selected?: DropDownOption<T>[];
  options?: DropDownOption<T>[];
  onChange?: (values: T[]) => void;
  className?: string;
  buttonType?: ButtonType;
};

/**
 * `options`: All possible options that can be selected.
 * `selected`: Selected values if state is managed outside this component.
 */
export function MultiSelect<T>({
  label,
  optionsLabel,
  selectedLabel,
  selectAllBtnTxt = '+',
  unselectAllBtnTxt = '-',
  className,
  selected: initialValues = [],
  options = [],
  onChange,
  buttonType = 'button',
}: MultiSelectProps<T>) {
  const [searchUnselected, setSearchUnselected] = useState('');
  const [searchSelected, setSearchSelected] = useState('');
  const [selected, setSelected] = useState<DropDownOption<T>[]>(initialValues);

  const filteredOptions = useMemo(
    () => options.filter((item) => searchFilter(item, searchUnselected)).filter((item) => !exists(item, selected)),
    [options, searchUnselected, selected],
  );

  const filteredSelected = useMemo(
    () => selected.filter((item) => searchFilter(item, searchSelected)),
    [searchSelected, selected],
  );

  function selectItem(item: DropDownOption<T>) {
    const updatedSelected = [...selected, item];
    setSelected(updatedSelected);
    onChange?.(updatedSelected.map((_item) => _item.value));
  }

  function unselectItem(item: DropDownOption<T>) {
    const updatedSelected = selected.filter((_item) => _item !== item);
    setSelected(updatedSelected);
    onChange?.(updatedSelected.map((_item) => _item.value));
  }

  return (
    <label className={className}>
      {label}
      <div className={styles.row}>
        <div className={styles.col}>
          {optionsLabel}
          <InputField<string> placeholder={'Search...'} onChange={(e) => setSearchUnselected(e)} />
          {filteredOptions.map((item, i) => (
            <Button
              type={buttonType}
              className={styles.item}
              key={`${i}-${item.value}`}
              display="block"
              theme="samf"
              onClick={() => selectItem(item)}
            >
              {item.label}
            </Button>
          ))}
          {filteredOptions.length > 0 && (
            <Button theme="blue" onClick={() => setSelected(options)} type={buttonType}>
              {selectAllBtnTxt}
            </Button>
          )}
        </div>

        <div className={styles.col}>
          {selectedLabel}
          <InputField<string> placeholder={'Search...'} onChange={(e) => setSearchSelected(e)} />
          {filteredSelected.map((item, i) => (
            <Button
              type={buttonType}
              className={styles.item}
              key={`${i}-${item.value}`}
              display="block"
              theme="white"
              onClick={() => unselectItem(item)}
            >
              {item.label}
            </Button>
          ))}
          {filteredSelected.length > 0 && (
            <Button type={buttonType} theme="blue" onClick={() => setSelected([])}>
              {unselectAllBtnTxt}
            </Button>
          )}
        </div>
      </div>
    </label>
  );
}
