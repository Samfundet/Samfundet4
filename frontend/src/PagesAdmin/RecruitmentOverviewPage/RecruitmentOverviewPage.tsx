import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { TabView } from '~/Components';
import type { Tab } from '~/Components/TabBar/TabBar';
import { AdminPageLayout } from '~/PagesAdmin/AdminPageLayout/AdminPageLayout';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { RecruitmentProgression } from './Components/RecruitmentProgression';
import { RecruitmentStatistics } from './Components/RecruitmentStatistics';

export function RecruitmentOverviewPage() {
  const { t } = useTranslation();
  const RECRUITMENT_TITLE_PLACEHOLDER: string = 'PLACEHOLDER-RECRUITMENT-TITLE';
  const tabs: Tab<ReactNode>[] = [
    { key: 1, label: t(KEY.recruitment_progression), value: <RecruitmentProgression /> },
    { key: 2, label: t(KEY.recruitment_statistics), value: <RecruitmentStatistics /> },
  ];
  useTitle(`${t(KEY.recruitment_overview)}`);
  return (
    <AdminPageLayout title={`${t(KEY.recruitment_overview)}: ${RECRUITMENT_TITLE_PLACEHOLDER}`}>
      <TabView tabs={tabs} />
    </AdminPageLayout>
  );
}
