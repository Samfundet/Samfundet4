import { Icon } from '@iconify/react';
import classNames from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '~/Components';
import { useDesktop } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { Button } from '../Button';
import type { DropdownOption } from '../Dropdown/Dropdown';
import styles from './MultiSelect.module.scss';
import { SelectBox } from './SelectBox';
import { exists, searchFilter } from './utils';

type MultiSelectProps<T> = {
  optionsLabel?: string;
  selectedLabel?: string;
  selected?: DropdownOption<T>[];
  options?: DropdownOption<T>[];
  onChange?: (values: T[]) => void;
  className?: string;
};

/**
 * `options`: All possible options that can be selected.
 * `selected`: Selected values if state is managed outside this component.
 */
function MultiSelectInner<T>(
  { optionsLabel, selectedLabel, className, selected: initialValues = [], options = [], onChange }: MultiSelectProps<T>,
  ref: React.Ref<HTMLDivElement>,
) {
  const { t } = useTranslation();
  const isDesktop = useDesktop();

  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<DropdownOption<T>[]>(initialValues);

  const filteredOptions = useMemo(
    () => options.filter((item) => searchFilter(item, search)).filter((item) => !exists(item, selected)),
    [options, search, selected],
  );

  const filteredSelected = useMemo(() => selected.filter((item) => searchFilter(item, search)), [search, selected]);

  useEffect(() => {
    onChange?.(selected.map((item) => item.value));
  }, [selected, onChange]);

  function selectItem(item: DropdownOption<T>) {
    setSelected((selected) => [...selected, item]);
  }

  function unselectItem(item: DropdownOption<T>) {
    setSelected((selected) => selected.filter((_item) => _item !== item));
  }

  function selectAll() {
    setSelected((selected) => [...selected, ...filteredOptions]);
  }

  function unselectAll() {
    setSelected(selected.filter((item) => !filteredSelected.includes(item)));
  }

  return (
    <div className={classNames(styles.container, className)} ref={ref}>
      <Input
        type="text"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        placeholder={`${t(KEY.common_search)}...`}
        className={styles.search_input}
      />
      <div className={styles.box_container}>
        <SelectBox items={filteredOptions} onItemClick={selectItem} label={optionsLabel} />

        <div className={styles.button_container}>
          <Button type="button" theme="blue" onClick={selectAll} disabled={filteredOptions.length === 0}>
            {t(KEY.common_select_all)}
            <Icon icon="radix-icons:double-arrow-right" rotate={isDesktop ? 0 : 1} />
          </Button>

          <Button type="button" theme="blue" onClick={unselectAll} disabled={filteredSelected.length === 0}>
            <Icon icon="radix-icons:double-arrow-right" rotate={isDesktop ? 2 : 3} />
            {t(KEY.common_unselect_all)}
          </Button>
        </div>

        <SelectBox items={filteredSelected} onItemClick={unselectItem} itemButtonTheme="white" label={selectedLabel} />
      </div>
    </div>
  );
}

export const MultiSelect = React.forwardRef(MultiSelectInner) as <T>(
  props: MultiSelectProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => ReturnType<typeof MultiSelectInner>;
(MultiSelect as React.ForwardRefExoticComponent<unknown>).displayName = 'MultiSelect';
