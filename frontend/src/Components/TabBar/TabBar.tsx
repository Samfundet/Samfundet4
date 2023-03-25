import classNames from 'classnames';
import { ReactElement } from 'react';
import styles from './TabBar.module.scss';

export type Tab<T = void> = {
  key: string | number;
  label: string | ReactElement;
  value?: T;
};

export type TabBarProps<T = void> = {
  tabs: Tab<T>[];
  selected?: Tab<T>;
  vertical?: boolean;
  spaceBetween?: boolean;
  disabled?: boolean;
  onSetTab?(tab: Tab<T>): void;
};

export function TabBar<T = void>({
  tabs,
  selected,
  vertical = false,
  spaceBetween = false,
  onSetTab,
  disabled = false,
}: TabBarProps<T>) {
  return (
    <div
      className={classNames(
        styles.tab_bar,
        vertical && styles.vertical,
        spaceBetween && styles.space_between,
        disabled && styles.disabled,
      )}
    >
      {tabs.map((tab: Tab<T>) => {
        const isSelected = selected !== undefined && tab.key === selected.key;
        return (
          <button
            className={classNames(styles.tab_button, isSelected && styles.selected)}
            disabled={disabled}
            onClick={() => onSetTab?.(tab)}
            key={tab.key}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
