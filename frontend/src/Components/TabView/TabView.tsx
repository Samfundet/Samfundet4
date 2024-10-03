import { type ReactElement, type ReactNode, useState } from 'react';
import { type Tab, TabBar } from '../TabBar/TabBar';

export type TabViewProps = {
  tabs: Tab<ReactElement | ReactNode>[];
  className?: string;
};

export function TabView({ tabs, className }: TabViewProps) {
  const [currentTab, setCurrentTab] = useState<Tab<ReactElement | ReactNode>>(tabs[0] ?? undefined);
  return (
    <div className={className}>
      <TabBar tabs={tabs} selected={currentTab} onSetTab={setCurrentTab} />
      {currentTab?.value}
    </div>
  );
}
