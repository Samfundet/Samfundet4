import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './DashboardAdminPage.module.scss';
import { Documents } from './sections/Documents';
import { Events } from './sections/Events';
import { Images } from './sections/Images';

export function DashboardAdminPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  useTitle(t(KEY.common_dashboard));

  const title = t(KEY.common_dashboard);
  const header = <></>;

  interface Section {
    title: string;
  }

  return (
    <AdminPageLayout title={title} header={header} loading={false}>
      <div className={styles.sections}>
        <Documents />
        <Events />
        <Images />
      </div>
    </AdminPageLayout>
  );
}
