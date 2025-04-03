import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { AdminPageLayout } from '~/PagesAdmin/AdminPageLayout/AdminPageLayout';
import { getRecruitmentAvailability } from '~/api';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { recruitmentKeys } from '~/queryKeys';
import { lowerCapitalize } from '~/utils';
import { RecruitmentInterviewAvailabilityForm } from './RecruitmentInterviewAvailabilityForm';

export function RecruitmentInterviewAvailabilityAdminPage() {
  const { t } = useTranslation();
  const title = lowerCapitalize(`${t(KEY.common_edit)} ${t(KEY.interview_availability)}`);
  useTitle(title);

  const { recruitmentId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: recruitmentKeys.availability(Number(recruitmentId)),
    queryFn: () => getRecruitmentAvailability(Number(recruitmentId)),
  });

  return (
    <AdminPageLayout title={title}>
      <p>{t(KEY.interview_availability_description)}</p>

      {!isLoading && <RecruitmentInterviewAvailabilityForm recruitmentId={Number(recruitmentId)} data={data?.data} />}
    </AdminPageLayout>
  );
}
