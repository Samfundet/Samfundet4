import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { AdminPageLayout } from '~/PagesAdmin/AdminPageLayout/AdminPageLayout';
import { getRecruitmentForRecruiter } from '~/api';
import type { RecruitmentForRecruiterDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { dbT } from '~/utils';
import { RecruitmentStatistics } from './RecruitmentStatistics/RecruitmentStatistics';

export function RecruitmentStatisticsAdminPage() {
  const { t } = useTranslation();
  const { recruitmentId } = useParams();

  const { data, isLoading, error } = useQuery<RecruitmentForRecruiterDto>({
    queryKey: ['recruitmentStats', recruitmentId],
    queryFn: () => getRecruitmentForRecruiter(recruitmentId as string),
    enabled: typeof recruitmentId === 'string',
  });

  useTitle(t(KEY.recruitment_overview));

  return (
    <AdminPageLayout title={`${t(KEY.recruitment_overview)}: ${dbT(data, 'name')}`}>
      <RecruitmentStatistics statistics={data?.statistics} />
    </AdminPageLayout>
  );
}
