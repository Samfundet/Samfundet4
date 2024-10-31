import { useTranslation } from 'react-i18next';
import { AdminPageLayout } from '~/PagesAdmin/AdminPageLayout/AdminPageLayout';
import { KEY } from '~/i18n/constants';

export function RoleAdminPage() {
  const { t } = useTranslation();

  return (
    <AdminPageLayout title={t(KEY.common_role)}>
      <div />
    </AdminPageLayout>
  );
}
