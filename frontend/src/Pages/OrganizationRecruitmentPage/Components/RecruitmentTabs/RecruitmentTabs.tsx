import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SamfundetLogoSpinner, type Tab, TabBar, Text } from '~/Components';
import { DepartmentTabs } from '~/Pages/OrganizationRecruitmentPage/Components/DepartmentTabs/DepartmentTabs';
import { NoPositions } from '~/Pages/RecruitmentPage/Components/NoPositions/NoPositions';
import { getGangList } from '~/api';
import { DepartmentDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { dbT } from '~/utils';
import styles from './RecruitmentTabs.module.scss';

export function RecruitmentTabs() {
  const [loading, setLoading] = useState(false);
  const [gangCategories, setGangCategories] = useState<DepartmentDto[]>([]);
  const [currentTab, setCurrentTab] = useState<Tab<DepartmentDto>>();
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
          const initialTab: Tab<DepartmentDto> = {
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

  const departmentTabs: Tab<DepartmentDto>[] = gangCategories.map((department) => ({
    key: department.id,
    label: dbT(department, 'title') ?? 'N/A',
    value: department,
  }));

  const handleSetTab = (tab: Tab<DepartmentDto>) => {
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
            tabs={departmentTabs}
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
          <DepartmentTabs currentDepartment={currentTab} />
        </>
      ) : (
        <NoPositions />
      )}
    </div>
  );
}
