import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router-dom';
import { AdminPageLayout } from '~/PagesAdmin/AdminPageLayout/AdminPageLayout';
import { RoleForm } from '~/PagesAdmin/RoleFormAdminPage/components';
import { KEY } from '~/i18n/constants';
import type { RoleLoader } from '~/router/loaders';
import { lowerCapitalize } from '~/utils';

export function RoleFormAdminPage() {
  const { t } = useTranslation();
  const data = useLoaderData() as RoleLoader | undefined;

  const title = lowerCapitalize(`${t(data?.role ? KEY.common_edit : KEY.common_create)} ${t(KEY.common_role)}`);
  return (
    <AdminPageLayout title={title}>
      <RoleForm role={data?.role} />
    </AdminPageLayout>
  );
}
