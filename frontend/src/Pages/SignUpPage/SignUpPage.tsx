import { useTranslation } from 'react-i18next';
import { H2, Link, Page } from '~/Components';
import { SignUpForm } from '~/Pages/SignUpPage/SignUpForm';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './SignUpPage.module.scss';

export function SignUpPage() {
  const { t } = useTranslation();

  useTitle(t(KEY.loginpage_register));

  return (
    <Page>
      <div className={styles.login_container}>
        <div className={styles.content_container}>
          <H2 className={styles.center}>{t(KEY.loginpage_register)}</H2>

          <SignUpForm />

          <Link url={ROUTES.frontend.login} className={styles.link}>
            {t(KEY.signuppage_login_link)}
          </Link>
        </div>
      </div>
    </Page>
  );
}
