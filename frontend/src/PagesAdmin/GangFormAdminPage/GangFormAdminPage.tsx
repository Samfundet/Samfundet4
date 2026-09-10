import { useTranslation } from 'react-i18next';
import { useLoaderData, useNavigate } from 'react-router';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import type { GangLoader } from '~/router/loaders';
import { ROUTES } from '~/routes';
import { lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './GangFormAdminPage.module.scss';
import { GangForm } from './components';

export function GangFormAdminPage() {
  const { t } = useTranslation();
  const data = useLoaderData() as GangLoader | undefined;
  const navigate = useNavigate();

  const title = lowerCapitalize(`${t(data?.gang ? KEY.common_edit : KEY.common_create)} ${t(KEY.common_gang)}`);
  useTitle(title);

  return (
    <AdminPageLayout title={title}>
      <div className={styles.wrapper}>
        <GangForm
          gang={data?.gang}
          onSuccess={(id?: number) =>
            navigate(
              id
                ? reverse({
                    pattern: ROUTES.frontend.admin_gangs_view,
                    urlParams: { gangId: id },
                  })
                : ROUTES.frontend.admin_gangs,
            )
          }
        />
      </div>
    </AdminPageLayout>
  );
}
