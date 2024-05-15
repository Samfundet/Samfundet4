import { GangDto, GangTypeDto } from '~/dto';
import { useCallback, useEffect, useState } from 'react';
import { Tab, TabBar, Text } from '~/Components';
import { dbT } from '~/utils';
import { PositionsTable } from '~/Pages/OrganizationRecruitmentPage/Components/PositionsTable/PositionsTable';
import styles from './GangsTabs.module.scss';
import { useDesktop } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { useTranslation } from 'react-i18next';

type GangTabsProps = {
  currentGangCategory: Tab<GangTypeDto>;
};

export function GangsTabs({ currentGangCategory }: GangTabsProps) {
  const [isLoading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState<Tab<GangDto>>();
  const [gangs, setGangs] = useState<GangDto[]>([]);
  const isDesktop = useDesktop();
  const { t } = useTranslation();

  useEffect(() => {
    if (!currentGangCategory.value) {
      return;
    }
    setLoading(true);
    setGangs(currentGangCategory.value.gangs);
    if (gangs.length > 0) {
      const initialTab: Tab<GangDto> = {
        key: gangs[0].id,
        label: dbT(gangs[0], 'name') ?? 'N/A',
        value: gangs[0],
      };
      setCurrentTab(initialTab);
    }
    setLoading(false);
  }, [currentGangCategory, gangs]);

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
    <div className={styles.gangsTabsContainer}>
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
        <Text as={'strong'} size={'l'}>
          {t(KEY.recruitment_no_gangs)}
        </Text>
      )}
    </div>
  );
}
