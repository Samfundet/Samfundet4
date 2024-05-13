import { GangDto, GangTypeDto } from '~/dto';
import { useEffect, useState } from 'react';
import { Tab, TabBar } from '~/Components';
import { dbT } from '~/utils';
import { PositionsTable } from '~/Pages/OrganizationRecruitmentPage/Components/PositionsTable/PositionsTable';
import styles from './GangTabs.module.scss';

type GangTabsProps = {
  currentGangType: Tab<GangTypeDto>;
};

export function GangTabs({ currentGangType }: GangTabsProps) {
  const [currentTab, setCurrentTab] = useState<Tab<GangDto>>();
  const [gangs, setGangs] = useState<GangDto[]>([]);

  useEffect(() => {
    if (!currentGangType.value) {
      return;
    }
    setGangs(currentGangType.value.gangs);
    if (gangs.length > 0) {
      const initialTab: Tab<GangDto> = {
        key: gangs[0].id,
        label: dbT(gangs[0], 'name') ?? 'possible dbt problem',
        value: gangs[0],
      };
      setCurrentTab(initialTab);
    }
  }, [currentGangType, gangs]);

  const gangTabs: Tab<GangDto>[] = gangs.map((gang) => ({
    key: gang.id,
    label: dbT(gang, 'name') ?? 'possible dbt problem',
    value: gang,
  }));

  const handleSetTab = (tab: Tab<GangDto>) => {
    setCurrentTab(tab);
  };

  return (
    <div className={styles.gangTabsContainer}>
      {gangs.length > 0 ? (
        <div>
          <TabBar
            tabs={gangTabs}
            selected={currentTab}
            onSetTab={handleSetTab}
            compact={true}
            spaceBetween={true}
            disabled={false}
            vertical={true}
          />

          <PositionsTable currentSelectedGang={currentTab?.value} />
        </div>
      ) : (
        <p>Ingen gjenger</p>
      )}
    </div>
  );
}
