import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SamfundetLogoSpinner, type Tab, TabBar, Text } from '~/Components';
import { GangsTabs } from '~/Pages/OrganizationRecruitmentPage/Components/GangsTabs/GangsTabs';
import { NoPositions } from '~/Pages/RecruitmentPage/Components/NoPositions/NoPositions';
import { getGangList } from '~/api';
import type { GangTypeDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { dbT } from '~/utils';
import styles from './RecruitmentTabs.module.scss';

export function RecruitmentTabs() {
  const [loading, setLoading] = useState(false);
  const [gangCategories, setGangCategories] = useState<GangTypeDto[]>([]);
  const [currentTab, setCurrentTab] = useState<Tab<GangTypeDto>>();
  const { t } = useTranslation();

  useEffect(() => {
    setLoading(true);
    getGangList()
      //TODO: DO IN ISSUE #1121, only get GANG TYPES recruiting in "this" recruitment.
      // also, this API call should probably be renamed "getGangCategoryList"
      // THIS CAN ALSO BE USED IN GangsTypeContainer/GangPositionDropdown
      .then((response) => {
        setGangCategories(response);
        if (response.length > 0) {
          const initialTab: Tab<GangTypeDto> = {
            key: response[0].id,
            label: dbT(response[0], 'title') ?? 'N/A',
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

  const gangTypeTabs: Tab<GangTypeDto>[] = gangCategories.map((gangType) => ({
    key: gangType.id,
    label: dbT(gangType, 'title') ?? 'N/A',
    value: gangType,
  }));

  const handleSetTab = (tab: Tab<GangTypeDto>) => {
    setCurrentTab(tab);
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
