import { useTranslation } from 'react-i18next';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { AdminPage } from '../AdminPageLayout';
import { MDBConnectForm } from './MDBConnectForm';
import styles from './MDBConnectFormAdminPage.module.scss';

export function MDBConnectFormAdminPage() {
  const { t } = useTranslation();
  useTitle(t(KEY.adminpage_connect_mdb));

  return (
    <AdminPage title={t(KEY.adminpage_connect_mdb)}>
      <div className={styles.wrapper}>
        <MDBConnectForm />
      </div>
    </AdminPage>
  );
}
