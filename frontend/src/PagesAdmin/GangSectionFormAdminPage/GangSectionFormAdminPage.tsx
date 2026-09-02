import { useTranslation } from 'react-i18next';
import { Navigate, useRouteLoaderData } from 'react-router';
import { LastUpdatedByHeader } from '~/Components';
import { AdminPageLayout } from '~/PagesAdmin/AdminPageLayout/AdminPageLayout';
import { GangSectionForm } from '~/PagesAdmin/GangSectionFormAdminPage/components';
import { useCustomNavigate, useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import type { GangLoader, GangSectionLoader } from '~/router/loaders';
import { ROUTES } from '~/routes';
import { lowerCapitalize } from '~/utils';
import styles from './GangSectionFormAdminPage.module.scss';

export function GangSectionFormAdminPage() {
  const { t } = useTranslation();
  const gangData = useRouteLoaderData('admin-gang') as GangLoader;
  const data = useRouteLoaderData('admin-gang-section') as GangSectionLoader | undefined;
  const title = lowerCapitalize(`${t(data?.section ? KEY.common_edit : KEY.common_create)} ${t(KEY.common_section)}`);
  useTitle(title);
  const navigate = useCustomNavigate();

  if (!gangData.gang) {
    return <Navigate to={ROUTES.frontend.admin_gangs} />;
  }

  const header = data?.section && (
    <div>
      <LastUpdatedByHeader model={data?.section} />
    </div>
  );

  return (
    <AdminPageLayout title={title} header={header}>
      <div className={styles.wrapper}>
        <GangSectionForm
          gang={gangData.gang}
          section={data?.section}
          onSuccess={() =>
            navigate({
              url: reverse({
                pattern: ROUTES.frontend.admin_gangs_view,
                urlParams: { gangId: gangData.gang?.id },
              }),
            })
          }
        />
      </div>
    </AdminPageLayout>
  );
}
