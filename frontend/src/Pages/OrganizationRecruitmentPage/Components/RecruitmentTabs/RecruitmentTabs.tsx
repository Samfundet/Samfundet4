import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SamfundetLogoSpinner, type Tab, TabBar, Text } from '~/Components';
import { GangsTabs } from '~/Pages/OrganizationRecruitmentPage/Components/GangsTabs/GangsTabs';
import { NoPositions } from '~/Pages/RecruitmentPage/Components/NoPositions/NoPositions';
import { type GangTypeDto, useGetOrganizedGangs } from '~/domain';
import { KEY } from '~/i18n/constants';
import { dbT } from '~/utils';
import styles from './RecruitmentTabs.module.scss';

export function RecruitmentTabs() {
  const [selectedTab, setSelectedTab] = useState<Tab<GangTypeDto>>();
  const { t } = useTranslation();

  //TODO: DO IN ISSUE #1121, only get GANG TYPES recruiting in "this" recruitment.
  // also, this API call should probably be renamed "getGangCategoryList"
  // THIS CAN ALSO BE USED IN GangsTypeContainer/GangPositionDropdown
  const { data: gangCategories = [], isLoading: loading } = useGetOrganizedGangs();

  const gangTypeTabs: Tab<GangTypeDto>[] = gangCategories.map((gangType) => ({
    key: gangType.id,
    label: dbT(gangType, 'title') ?? 'N/A',
    value: gangType,
  }));

  const currentTab: Tab<GangTypeDto> | undefined = selectedTab ?? gangTypeTabs[0];

  const handleSetTab = (tab: Tab<GangTypeDto>) => {
    setSelectedTab(tab);
  };

  return (
    <div className={styles.recruitmentTabsContainer}>
      {loading ? (
        <SamfundetLogoSpinner />
      ) : currentTab ? (
        <>
          <Text size={'l'} as={'strong'}>
            {`${t(KEY.common_gang)} ${t(KEY.category)}`}
          </Text>
          <TabBar
            tabs={gangTypeTabs}
            selected={currentTab}
            onSetTab={handleSetTab}
            compact={true}
            spaceBetween={false}
            spaceAround={true}
            disabled={loading}
          />
          <Text size={'l'} as={'strong'}>
            {t(KEY.common_gang)}
          </Text>
          <GangsTabs currentGangCategory={currentTab} />
        </>
      ) : (
        <NoPositions />
      )}
    </div>
  );
}
