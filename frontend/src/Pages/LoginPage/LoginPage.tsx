import { Button, InputField } from '~/Components';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '~/routes';
import styles from './LoginPage.module.scss';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';

export function LoginPage() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  function handleLogin() {
    //TODO: add function logic
  }

  return (
    <div className={styles.container}>
      <div className={styles.content_container}>
        <h1 className={styles.header_text}>{t(KEY.login_internal_login)}</h1>
        <InputField
          className={styles.input_field}
          placeholder={t(KEY.login_email_placeholder)}
          onChange={(e) => setName(e ? e.currentTarget.value : '')}
        />
        <InputField
          className={styles.input_field}
          placeholder={t(KEY.common_password)}
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
