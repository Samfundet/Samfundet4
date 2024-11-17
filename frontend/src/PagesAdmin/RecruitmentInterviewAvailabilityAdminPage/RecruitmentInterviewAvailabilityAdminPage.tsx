import { useTranslation } from 'react-i18next';
import { AdminPageLayout } from '~/PagesAdmin/AdminPageLayout/AdminPageLayout';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { lowerCapitalize } from '~/utils';
import { RecruitmentInterviewAvailabilityForm } from './RecruitmentInterviewAvailabilityForm';

export function RecruitmentInterviewAvailabilityAdminPage() {
  const { t } = useTranslation();
  const title = lowerCapitalize(`${t(KEY.common_edit)} ${t(KEY.interview_availability)}`);
  useTitle(title);

  return (
    <AdminPageLayout title={title}>
      <p>{t(KEY.interview_availability_description)}</p>

      <RecruitmentInterviewAvailabilityForm />
    </AdminPageLayout>
  );
}
