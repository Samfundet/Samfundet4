import classNames from 'classnames';
import type { ReactElement } from 'react';
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
  spaceAround?: boolean;
  disabled?: boolean;
  compact?: boolean;
  onSetTab?(tab: Tab<T>): void;
};

export function TabBar<T = void>({
  tabs,
  selected,
  vertical = false,
  spaceBetween = false,
  spaceAround = false,
  compact = false,
  onSetTab,
  disabled = false,
}: TabBarProps<T>) {
  return (
    <div
      className={classNames(
        styles.tab_bar,
        compact && styles.compact,
        vertical && styles.vertical,
        spaceBetween && styles.space_between,
        disabled && styles.disabled,
        spaceAround && styles.space_around,
      )}
    >
      {tabs.map((tab: Tab<T>) => {
        const isSelected = selected !== undefined && tab.key === selected.key;
        return (
          <button
            type="button"
            className={classNames(styles.tab_button, isSelected && styles.selected)}
            disabled={disabled}
            onClick={(e) => {
              e.preventDefault();
              onSetTab?.(tab);
            }}
            key={tab.key}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
