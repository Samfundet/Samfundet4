import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '~/AuthContext';
import { Alert, Page } from '~/Components';
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
  const { setUser } = useAuthContext();
  const navigate = useNavigate();

  function handleLogin(formData: Record<string, string>) {
    login(formData['name'], formData['password'])
      .then((status) => {
        if (status === STATUS.HTTP_202_ACCEPTED) {
          getUser()
            .then((user) => {
              setUser(user);
            })
            .catch();
          navigate(ROUTES.frontend.home);
        } else {
          setLoginFailed(true);
        }
      })
      .catch(() => {
        setLoginFailed(true);
      });
  }

  return (
    <Page>
      <div className={styles.login_container}>
        {loginFailed && (
          <Alert
            message="Login failed"
            type="error"
            align="center"
            closable={true}
            onClose={() => {
              setLoginFailed(false);
            }}
          ></Alert>
        )}
        <div className={styles.content_container}>
          <SamfForm onSubmit={handleLogin} submitText={t(KEY.common_login) ?? ''}>
            <h1 className={styles.header_text}>{t(KEY.loginpage_internal_login)}</h1>
            <SamfFormField field="name" type="text" label={t(KEY.loginpage_email_placeholder) ?? ''} />
            <SamfFormField field="password" type="password" label={t(KEY.common_password) ?? ''} />
          </SamfForm>
          <Link to={ROUTES.frontend.signup} className={styles.forgotten_password}>
            {t(KEY.loginpage_forgotten_password)}
          </Link>
        </div>
      </div>
    </Page>
  );
}
