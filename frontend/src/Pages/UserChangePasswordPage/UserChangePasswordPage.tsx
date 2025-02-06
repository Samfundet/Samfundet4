import { useTranslation } from 'react-i18next';
import { AdminPageLayout } from '~/PagesAdmin/AdminPageLayout/AdminPageLayout';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { ChangePasswordForm } from './ChangePasswordForm';

export function UserChangePasswordPage() {
  const { t } = useTranslation();
  const title = t(KEY.change_password);
  useTitle(title);

  return (
    <AdminPageLayout title={title}>
      <ChangePasswordForm />
    </AdminPageLayout>
  );
}
