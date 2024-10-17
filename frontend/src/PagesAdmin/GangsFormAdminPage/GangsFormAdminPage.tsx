import { useTranslation } from 'react-i18next';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import type { GangLoader } from '~/router/loaders';
import { ROUTES } from '~/routes';
import { lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import { GangForm } from './components';

export function GangsFormAdminPage() {
  const { t } = useTranslation();
  const data = useLoaderData() as GangLoader | undefined;
  const navigate = useNavigate();

  //TODO add permissions on render

  const title = lowerCapitalize(`${t(data?.gang ? KEY.common_edit : KEY.common_create)} ${t(KEY.common_gang)}`);
  useTitle(title);

  return (
    <AdminPageLayout title={title} header={true}>
      <GangForm gang={data?.gang} onSuccess={() => navigate(ROUTES.frontend.admin_gangs)} />
    </AdminPageLayout>
  );
}
