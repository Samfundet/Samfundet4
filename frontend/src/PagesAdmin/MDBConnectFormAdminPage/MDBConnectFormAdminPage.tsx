import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import styles from './MDBConnectFormAdminPage.module.scss';
import { AdminPage } from '../AdminPageLayout';
import { MDBConnectForm } from './MDBConnectForm';


export function MDBConnectFormAdminPage() {
  const { t } = useTranslation();

  return (
    <AdminPage title={t(KEY.adminpage_connect_mdb_extended)}>
      <div className={styles.wrapper}>
        <MDBConnectForm></MDBConnectForm>
      </div>
    </AdminPage>
  );
}
