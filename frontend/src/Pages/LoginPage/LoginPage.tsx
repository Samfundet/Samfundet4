import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, login } from '~/api';
import { useAuthContext } from '~/AuthContext';
import { Alert, Button, InputField } from '~/Components';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './LoginPage.module.scss';

export function LoginPage() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loginFailed, setLoginFailed] = useState(false);
  const { setUser } = useAuthContext();
  const navigate = useNavigate();

  function handleLogin() {
    login(name, password)
      .then((status) => {
        if (status === 202) {
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
    <div className={styles.container}>
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
        <h1 className={styles.header_text}>{t(KEY.login_internal_login)}</h1>
        <InputField
          className={styles.input_field}
          placeholder={t(KEY.login_email_placeholder) || undefined}
          onChange={(e) => setName(e ? e.currentTarget.value : '')}
        />
        <InputField
          className={styles.input_field}
          placeholder={t(KEY.common_password) || undefined}
          type="password"
          onChange={(e) => setPassword(e?.currentTarget.value || '')}
        />
        <Button className={styles.login_button} onClick={handleLogin} theme="samf">
          {t(KEY.common_login)}
        </Button>
        <Link to={ROUTES.frontend.signup} className={styles.forgotten_password}>
          {t(KEY.login_forgotten_password)}
        </Link>
      </div>
    </div>
  );
}
