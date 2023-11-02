import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '~/AuthContext';
import { Page } from '~/Components';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { getUser, login } from '~/api';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './LoginPage.module.scss';

export function LoginPage() {
  const { t } = useTranslation();
  const [loginFailed, setLoginFailed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const location = useLocation();
  const { from } = location.state || {};
  const { user, setUser } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate(typeof from === 'undefined' ? ROUTES.frontend.home : from.pathname);
  }, [user, from, navigate]);

  function handleLogin(formData: Record<string, string>) {
    setSubmitting(true);
    login(formData['name'], formData['password'])
      .then((status) => {
        if (status === STATUS.HTTP_202_ACCEPTED) {
          getUser().then((user) => {
            setUser(user);
          });
          navigate(typeof from === 'undefined' ? ROUTES.frontend.home : from.pathname);
        } else {
          setLoginFailed(true);
        }
      })
      .catch((error) => {
        setLoginFailed(true);
        console.error(error);
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  return (
    <Page>
      <div className={styles.login_container}>
        <div className={styles.content_container}>
          <SamfForm onSubmit={handleLogin} isDisabled={submitting} submitText={t(KEY.common_login) ?? ''}>
            <h1 className={styles.header_text}>{t(KEY.loginpage_internal_login)}</h1>
            <SamfFormField field="name" type="text" label={t(KEY.loginpage_email_placeholder) ?? ''} />
            <SamfFormField field="password" type="password" label={t(KEY.common_password) ?? ''} />
            {loginFailed && <p className={styles.login_failed_comment}>{t(KEY.loginpage_login_failed)}</p>}
          </SamfForm>
          <Link to={ROUTES.frontend.signup} className={styles.link}>
            {t(KEY.loginpage_register)}
          </Link>
          <Link to={ROUTES.frontend.signup} className={styles.link}>
            {t(KEY.loginpage_forgotten_password)}
          </Link>
        </div>
      </div>
    </Page>
  );
}
