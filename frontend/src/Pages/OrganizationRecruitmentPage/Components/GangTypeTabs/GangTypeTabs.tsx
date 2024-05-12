import { GangTypeDto } from '~/dto';
import { SamfundetLogoSpinner, Tab, TabBar } from '~/Components';
import { dbT } from '~/utils';
import { useEffect, useState } from 'react';
import { getActiveRecruitmentPositions, getGangList } from '~/api';
import { GangTabs } from '~/Pages/OrganizationRecruitmentPage/Components/GangTab/GangTabs';
import { NoPostions } from '~/Pages/OrganizationRecruitmentPage/Components/NoPositions/NoPostions';

export function GangTypeTabs() {
  const [loading, setLoading] = useState(true);
  const [gangTypes, setGangTypes] = useState<GangTypeDto[]>();
  const [currentGangTypeTab, setCurrentGangTypeTab] = useState<Tab<GangTypeDto> | undefined>(undefined);

  useEffect(() => {
    Promise.all([getActiveRecruitmentPositions(), getGangList()])
      .then(([, gangsRes]) => {
        setGangTypes(gangsRes);
        if (gangsRes.length > 0) {
          const initialTab: Tab<GangTypeDto> = {
            key: gangsRes[0].id,
            label: dbT(gangsRes[0], 'title') ?? '?',
            value: gangsRes[0],
          };
          setCurrentGangTypeTab(initialTab);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
    console.log('useEffect');
  }, []);

  const gangTypeTabs: Tab<GangTypeDto>[] = gangTypes?.map((gangType) => ({
    key: gangType.id,
    label: dbT(gangType, 'title') ?? '?',
    value: gangType,
  }));

  const handleSetTab = (tab: Tab<GangTypeDto>) => {
    setCurrentGangTypeTab(tab);
  };

  return (
    <div>
      {loading ? (
        <SamfundetLogoSpinner />
      ) : gangTypes ? (
        <div>
          <TabBar tabs={gangTypeTabs} selected={currentGangTypeTab} onSetTab={handleSetTab} />
          <GangTabs currentGangType={currentGangTypeTab} />
        </div>
      ) : (
        <NoPostions />
      )}
    </div>
  );
}
