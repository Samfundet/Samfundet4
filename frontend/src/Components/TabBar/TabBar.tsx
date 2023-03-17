import classNames from 'classnames';
import { ReactElement } from 'react';
import styles from './TabBar.module.scss';

export type Tab = {
  key: string | number;
  label: string | ReactElement;
};

export type TabBarProps = {
  tabs: Tab[];
  selected: Tab;
  vertical?: boolean;
  spaceBetween?: boolean;
  onSetTab?(tab: Tab): void;
};

export function TabBar({ tabs, selected, vertical = false, spaceBetween = false, onSetTab }: TabBarProps) {
  return (
    <div className={classNames(styles.tab_bar, vertical && styles.vertical, spaceBetween && styles.space_between)}>
      {tabs.map((tab: Tab) => {
        const isSelected = tab.key === selected.key;
        return (
          <button
            className={classNames(styles.tab_button, isSelected && styles.selected)}
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
