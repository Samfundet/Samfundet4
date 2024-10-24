import { useTranslation } from 'react-i18next';
import { AdminPageLayout } from '~/PagesAdmin/AdminPageLayout/AdminPageLayout';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';

export function RoleAdminPage() {
  const { t } = useTranslation();
  const title = t(KEY.common_roles_view);
  useTitle(title);

  return (
    <AdminPageLayout title={title}>
      <div />
    </AdminPageLayout>
  );
}
