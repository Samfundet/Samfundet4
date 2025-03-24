import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { type Tab, TabView } from '~/Components';
import { AdminPageLayout } from '~/PagesAdmin/AdminPageLayout/AdminPageLayout';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { RecruitmentStatistics } from './RecruitmentStatistics/RecruitmentStatistics';

export function RecruitmentStatisticsAdminPage() {
  const { t } = useTranslation();
  const { recruitmentId } = useParams();

  useTitle(t(KEY.recruitment_overview));
  const tabs: Tab<ReactNode>[] = useMemo(() => {
    return [
      { key: 1, label: 'TEST', value: <div>Test</div> },
      { key: 2, label: t(KEY.recruitment_statistics), value: <RecruitmentStatistics recruitmentId={recruitmentId} /> },
    ];
  }, [recruitmentId, t]);

  return (
    <AdminPageLayout title={`${t(KEY.recruitment_overview)} `}>
      <TabView tabs={tabs} />
    </AdminPageLayout>
  );
}
