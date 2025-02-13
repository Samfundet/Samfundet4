import { type ReactElement, type ReactNode, useEffect, useState } from 'react';
import { type Tab, TabBar } from '../TabBar/TabBar';

export type TabViewProps = {
  tabs: Tab<ReactElement | ReactNode>[];
  className?: string;
};

export function TabView({ tabs, className }: TabViewProps) {
  const [currentTab, setCurrentTab] = useState<Tab<ReactElement | ReactNode>>(tabs[0] ?? undefined);

  useEffect(() => {
    if (currentTab) {
      setCurrentTab(tabs.filter((tab) => tab.key === currentTab.key)[0]);
    }
  }, [tabs, currentTab]);

  return (
    <div className={className}>
      <TabBar tabs={tabs} selected={currentTab} onSetTab={setCurrentTab} />
      {currentTab?.value}
    </div>
  );
}
