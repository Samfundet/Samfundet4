import { AdminPageLayout } from '~/PagesAdmin/AdminPageLayout/AdminPageLayout';
import { Tab, TabBar } from '~/Components/TabBar/TabBar';
import { RecruitmentStatistics } from './Components/RecruitmentStatistics';
import { RecruitmentProgression } from './Components/RecruitmentProgression';
import { ReactNode, useState } from 'react';
import styles from '~/PagesAdmin/RecruitmentOverviewPage/Components/RecruitmentProgression/RecruitmentProgression.module.scss';
import { Text } from '~/Components/Text/Text';

export function RecruitmentOverviewPage() {
  const [currentTab, setCurrentTab] = useState<Tab<ReactNode>>({
    key: 1,
    label: 'Recruitment Progression',
    value: <RecruitmentProgression />,
  });
  const RECRUITMENT_TITLE = 'PLACEHOLDER_TITLE_24';
  const tabs: Tab<ReactNode>[] = [
    { key: 1, label: 'Recruitment Progression', value: <RecruitmentProgression /> },
    { key: 2, label: 'Recruitment Statistics', value: <RecruitmentStatistics /> },
  ];
  // Data is fetched in the components
  return (
    <AdminPageLayout title={'Recruitment Overview'}>
      <div className={styles.subHeader}>
        {' '}
        <Text as={'strong'} size={'l'}>
          RecruitmentProgression
          {' ' + RECRUITMENT_TITLE}
        </Text>
      </div>
      <TabBar tabs={tabs} selected={currentTab} onSetTab={setCurrentTab} />
      {currentTab?.value}
    </AdminPageLayout>
  );
}
