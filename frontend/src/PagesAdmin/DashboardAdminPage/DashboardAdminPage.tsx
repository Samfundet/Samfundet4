import { useTranslation } from 'react-i18next';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './DashboardAdminPage.module.scss';
import { GangCategory } from './components/GangCategory';
import { SubscriptionsCategory } from './components/SubscriptionsCategory';

export function DashboardAdminPage() {
  const { t } = useTranslation();
  useTitle(t(KEY.common_dashboard));

  const title = t(KEY.common_dashboard);

  return (
    <AdminPageLayout title={title} loading={false}>
      <div className={styles.categories}>
        <GangCategory />
        <SubscriptionsCategory />
      </div>
    </AdminPageLayout>
  );
}
