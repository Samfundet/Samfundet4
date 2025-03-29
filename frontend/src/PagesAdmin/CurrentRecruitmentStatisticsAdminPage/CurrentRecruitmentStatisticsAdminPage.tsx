import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { AdminPageLayout } from '~/PagesAdmin/AdminPageLayout/AdminPageLayout';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { RecruitmentStatistics } from './RecruitmentStatistics/RecruitmentStatistics';

export function CurrentRecruitmentStatisticsAdminPage() {
  const { t } = useTranslation();
  const { recruitmentId } = useParams();

  useTitle(t(KEY.recruitment_overview));

  return (
    <AdminPageLayout title={`${t(KEY.recruitment_overview)} `}>
      <RecruitmentStatistics recruitmentId={recruitmentId} />
    </AdminPageLayout>
  );
}
