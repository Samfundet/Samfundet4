import { GangDto, GangTypeDto } from '~/dto';
import { useEffect, useState } from 'react';
import { Tab, TabBar } from '~/Components';
import { dbT } from '~/utils';
import { PositionsTable } from '~/Pages/OrganizationRecruitmentPage/Components/PositionsTable/PositionsTable';

type GangTabsProps = {
  currentGangType: Tab<GangTypeDto> | undefined;
};

export function GangTabs({ currentGangType }: GangTabsProps) {
  const [currentTab, setCurrentTab] = useState<Tab<GangDto> | undefined>(undefined);
  const [gangs, setGangs] = useState<GangDto[]>();

  useEffect(() => {
    if (!currentGangType) {
      return;
    }
    setGangs(currentGangType.value?.gangs);
    if (gangs) {
      const initialTab: Tab<GangDto> = {
        key: gangs[0].id,
        label: dbT(gangs[0], 'name') ?? 'possible dbt problem',
        value: gangs[0],
      };
      setCurrentTab(initialTab);
    }
    console.log('useEffect');
  }, [currentGangType, gangs]);

  const gangTabs: Tab<GangDto>[] = gangs?.map((gang) => ({
    key: gang.id,
    label: dbT(gang, 'name') ?? '?',
    value: gang,
  }));

  const handleSetTab = (tab: Tab<GangDto>) => {
    setCurrentTab(tab);
  };

  return (
    <div>
      {gangs ? (
        <div>
          <TabBar tabs={gangTabs} selected={currentTab} onSetTab={handleSetTab} />
          <PositionsTable currentSelectedGang={currentTab?.value} />
        </div>
      ) : (
        <p>Ingen gjenger</p>
      )}
    </div>
  );
}
