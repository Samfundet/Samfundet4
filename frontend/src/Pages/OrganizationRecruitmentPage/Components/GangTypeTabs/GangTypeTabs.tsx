import { GangTypeDto } from '~/dto';
import { SamfundetLogoSpinner, Tab, TabBar } from '~/Components';
import { dbT } from '~/utils';
import { useEffect, useState } from 'react';
import { getGangList } from '~/api';
import { GangTabs } from '~/Pages/OrganizationRecruitmentPage/Components/GangTab/GangTabs';
import { NoPostions } from '~/Pages/OrganizationRecruitmentPage/Components/NoPositions/NoPostions';
import styles from './GangTypeTabs.module.scss';

export function GangTypeTabs() {
  const [loading, setLoading] = useState(true);
  const [gangTypes, setGangTypes] = useState<GangTypeDto[]>([]);
  const [currentTab, setCurrentTab] = useState<Tab<GangTypeDto>>();

  //TODO: filter recruitment positions on gang id in backend? DO IN ISSUE #1121
  useEffect(() => {
    getGangList()
      .then((response) => {
        setGangTypes(response);
        if (response.length > 0) {
          const initialTab: Tab<GangTypeDto> = {
            key: response[0].id,
            label: dbT(response[0], 'title') ?? 'possible dbt problem',
            value: response[0],
          };
          setCurrentTab(initialTab);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const gangTypeTabs: Tab<GangTypeDto>[] = gangTypes.map((gangType) => ({
    key: gangType.id,
    label: dbT(gangType, 'title') ?? 'possible dbt problem',
    value: gangType,
  }));

  const handleSetTab = (tab: Tab<GangTypeDto>) => {
    setCurrentTab(tab);
  };

  return (
    <div className={styles.gangTypesTabsContainer}>
      {loading ? (
        <SamfundetLogoSpinner />
      ) : currentTab ? (
        <div>
          <TabBar tabs={gangTypeTabs} selected={currentTab} onSetTab={handleSetTab} />
          <GangTabs currentGangType={currentTab} />
        </div>
      ) : (
        <NoPostions />
      )}
    </div>
  );
}
