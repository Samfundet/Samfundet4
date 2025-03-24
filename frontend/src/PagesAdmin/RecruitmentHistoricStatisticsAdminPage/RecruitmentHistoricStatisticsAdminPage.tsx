import { useTranslation } from 'react-i18next';
import { H1 } from '~/Components';
import { AdminPageLayout } from '~/PagesAdmin/AdminPageLayout/AdminPageLayout';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';

export function RecruitmentHistoricStatisticsAdminPage() {
  const { t } = useTranslation();

  useTitle(t(KEY.recruitment_overview));

  return (
    <AdminPageLayout title={`${t(KEY.recruitment_overview)} `}>
      <H1>TEST</H1>
    </AdminPageLayout>
  );
}
