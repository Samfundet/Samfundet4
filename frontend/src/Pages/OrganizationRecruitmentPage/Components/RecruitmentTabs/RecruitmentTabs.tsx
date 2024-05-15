import { GangTypeDto } from '~/dto';
import { SamfundetLogoSpinner, Tab, TabBar, Text } from '~/Components';
import { dbT } from '~/utils';
import { useEffect, useState } from 'react';
import { getGangList } from '~/api';
import { GangsTabs } from '~/Pages/OrganizationRecruitmentPage/Components/GangsTabs/GangsTabs';
import { NoPositions } from '~/Pages/OrganizationRecruitmentPage/Components/NoPositions/NoPositions';
import { KEY } from '~/i18n/constants';
import { useTranslation } from 'react-i18next';
import styles from './RecruitmentTabs.module.scss';

export function RecruitmentTabs() {
  const [loading, setLoading] = useState(false);
  const [gangCategories, setGangCategories] = useState<GangTypeDto[]>([]);
  const [currentTab, setCurrentTab] = useState<Tab<GangTypeDto>>();
  const { t } = useTranslation();

  useEffect(() => {
    setLoading(true);
    getGangList()
      //TODO: DO IN ISSUE #1121, only get gang types recruiting.
      // also, this API call should probably be renamed "getGangCategoryList"
      .then((response) => {
        setGangCategories(response);
        if (response.length > 0) {
          const initialTab: Tab<GangTypeDto> = {
            key: response[0].id,
            label: dbT(response[0], 'title') ?? 'N/A -- NOT IN SEED DATA!',
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
    label: dbT(gangType, 'title') ?? 'N/A -- NOT IN SEED DB! DATA',
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
            {t(KEY.common_gang) + ' ' + t(KEY.category)}
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
