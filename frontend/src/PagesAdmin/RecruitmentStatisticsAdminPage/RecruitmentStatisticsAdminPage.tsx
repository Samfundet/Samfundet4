import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { type Tab, TabView } from '~/Components';
import { AdminPageLayout } from '~/PagesAdmin/AdminPageLayout/AdminPageLayout';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { RecruitmentStatistics } from './RecruitmentStatistics/ThisRecruitmentStatistics';

export function RecruitmentStatisticsAdminPage() {
  const { t } = useTranslation();
  const { recruitmentId } = useParams();

  useTitle(t(KEY.recruitment_overview));
  const tabs: Tab<ReactNode>[] = useMemo(() => {
    return [
      { key: 1, label: 'This recruitment', value: <RecruitmentStatistics recruitmentId={recruitmentId} /> },
      { key: 2, label: 'Historic applicant statistics', value: <div>historic applicant statistics</div> },
      { key: 3, label: 'Historic campus statistics', value: <div>historic campus statistics</div> },
    ];
  }, [recruitmentId]);

  return (
    <AdminPageLayout title={`${t(KEY.recruitment_overview)} `}>
      <TabView tabs={tabs} />
    </AdminPageLayout>
  );
}
