import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router-dom';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import type { GangLoader } from '~/router/loaders';
import { lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import { GangsForm } from './components';

export function GangsFormAdminPage() {
  const { t } = useTranslation();
  const data = useLoaderData() as GangLoader | undefined;

  //TODO add permissions on render

  const title = lowerCapitalize(`${t(data?.gang ? KEY.common_edit : KEY.common_create)} ${t(KEY.common_gang)}`);
  useTitle(title);

  return (
    <AdminPageLayout title={title} header={true}>
      <GangsForm gang={data?.gang} />
    </AdminPageLayout>
  );
}
