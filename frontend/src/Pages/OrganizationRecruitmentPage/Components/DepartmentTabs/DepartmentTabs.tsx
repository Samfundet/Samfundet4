import { GangDto, DepartmentDto } from '~/dto';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type Tab, TabBar, Text } from '~/Components';
import { PositionsTable } from '~/Pages/OrganizationRecruitmentPage/Components/PositionsTable/PositionsTable';
import { useDesktop } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { dbT } from '~/utils';
import styles from './DepartmentTabs.module.scss';

type DepartmentTabsProps = {
  currentDepartment: Tab<DepartmentDto>;
};

export function DepartmentTabs({ currentDepartment }: DepartmentTabsProps) {
  const [isLoading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<Tab<GangDto>>();
  const [gangs, setGangs] = useState<GangDto[]>([]);
  const isDesktop = useDesktop();
  const { t } = useTranslation();

  useEffect(() => {
    if (!currentDepartment.value) {
      return;
    }
    setGangs(currentDepartment.value.gangs);
    if (gangs.length > 0) {
      const initialTab: Tab<GangDto> = {
        key: gangs[0].id,
        label: dbT(gangs[0], 'name') ?? 'N/A',
        value: gangs[0],
      };
      setCurrentTab(initialTab);
    }
    setLoading(false);
  }, [currentDepartment, gangs]);

  const setChildLoading = useCallback((loading: boolean) => {
    setLoading(loading);
  }, []);

  const gangTabs: Tab<GangDto>[] = gangs.map((gang) => ({
    key: gang.id,
    label: dbT(gang, 'name') ?? 'N/A',
    value: gang,
  }));

  const handleSetTab = (tab: Tab<GangDto>) => {
    setCurrentTab(tab);
  };

  return (
    <div className={styles.departmentTabsContainer}>
      {gangs.length > 0 ? (
        <>
          <TabBar
            tabs={gangTabs}
            selected={currentTab}
            onSetTab={handleSetTab}
            compact={true}
            spaceAround={true}
            vertical={!isDesktop}
            disabled={isLoading}
          />
          <PositionsTable currentSelectedGang={currentTab?.value} setLoading={setChildLoading} loading={isLoading} />
        </>
      ) : (
        <Text as="strong" size="l">
          {t(KEY.recruitment_no_gangs)}
        </Text>
      )}
    </div>
  );
}
