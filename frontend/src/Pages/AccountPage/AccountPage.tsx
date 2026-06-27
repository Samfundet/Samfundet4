import { useTranslation } from 'react-i18next';
import { H3 } from '~/Components';
import { AdminPageLayout } from '~/PagesAdmin/AdminPageLayout/AdminPageLayout';
import { useAuthContext } from '~/context/AuthContext';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { ROUTES_OTHER } from '~/routes/other';
import styles from './AccountPage.module.scss';
import { ChangePasswordForm, UserDetailsForm } from './components';

export function AccountPage() {
  const { t } = useTranslation();
  const { user } = useAuthContext();
  useTitle(t(KEY.common_account));

  return (
    <AdminPageLayout title={t(KEY.common_account)}>
      {/* TODO make proper personal landing page with preferences etc */}

      <div>
        <H3 className={styles.form_header}>{t(KEY.common_details)}</H3>
        {user?.mdb_medlem_id && (
          <>
            <p className={styles.mdb_notice}>
              {t(KEY.preferences_page_account_connected_mdb)}{' '}
              <a href={ROUTES_OTHER.samf_medlem}>
                {ROUTES_OTHER.samf_medlem.replace(/^https?:\/\//i, '').replace(/\/+$/, '')}
              </a>
              .
            </p>
          </>
        )}

        {user && (
          <div className={styles.form_container}>
            <UserDetailsForm user={user} disabled={!!user.mdb_medlem_id} />
          </div>
        )}
      </div>

      <div>
        <H3 className={styles.form_header}>Endre passord</H3>
        <div className={styles.form_container}>
          <ChangePasswordForm />
        </div>
      </div>
    </AdminPageLayout>
  );
}
