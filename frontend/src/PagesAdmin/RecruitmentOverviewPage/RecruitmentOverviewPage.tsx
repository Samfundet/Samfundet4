import { AdminPageLayout } from '~/PagesAdmin/AdminPageLayout/AdminPageLayout';
import { Tab, TabBar } from '~/Components/TabBar/TabBar';
import { RecruitmentStatistics } from './Components/RecruitmentStatistics';
import { RecruitmentProgression } from './Components/RecruitmentProgression';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';

export function RecruitmentOverviewPage() {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState<Tab<ReactNode>>({
    key: 1,
    label: t(KEY.recruitment_progression),
    value: <RecruitmentProgression />,
  });
  const RECRUITMENT_TITLE_PLACEHOLDER: string = 'PLACEHOLDER-RECRUITMENT-TITLE';
  const tabs: Tab<ReactNode>[] = [
    { key: 1, label: t(KEY.recruitment_progression), value: <RecruitmentProgression /> },
    { key: 2, label: t(KEY.recruitment_statistics), value: <RecruitmentStatistics /> },
  ];
  return (
    <AdminPageLayout title={t(KEY.recruitment_overview) + ': ' + RECRUITMENT_TITLE_PLACEHOLDER}>
      <TabBar tabs={tabs} selected={currentTab} onSetTab={setCurrentTab} />
      {currentTab?.value}
    </AdminPageLayout>
  );
}
