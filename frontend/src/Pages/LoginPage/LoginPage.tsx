import { useTranslation } from 'react-i18next';
import { Breadcrumb, H2, Link, Page } from '~/Components';
import { LoginForm } from '~/Pages/LoginPage/LoginForm';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './LoginPage.module.scss';

export function LoginPage() {
  const { t } = useTranslation();

  useTitle(t(KEY.common_login));

  return (
    <Page>
      <div className={styles.login_container}>
        <div className={styles.content_container}>
          <div style={{ paddingBottom: '1rem' }}>
            <Breadcrumb />
          </div>

          <H2 className={styles.center}>{t(KEY.loginpage_internal_login)}</H2>
          <LoginForm />

          <Link url={ROUTES.frontend.signup} className={styles.link}>
            {t(KEY.loginpage_register)}
          </Link>
          <Link url={ROUTES.frontend.signup} className={styles.link}>
            {t(KEY.loginpage_forgotten_password)}
          </Link>
        </div>
      </div>
    </Page>
  );
}
