import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { AdminPage } from '../AdminPageLayout';
import { MDBConnectForm } from './MDBConnectForm';
import styles from './MDBConnectFormAdminPage.module.scss';

export function MDBConnectFormAdminPage() {
  const { t } = useTranslation();

  return (
    <AdminPage title={t(KEY.adminpage_connect_mdb_extended)}>
      <div className={styles.wrapper}>
        <MDBConnectForm />
      </div>
    </AdminPage>
  );
}
