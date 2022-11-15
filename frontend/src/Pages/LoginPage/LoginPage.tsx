import { Button, InputField } from '~/Components';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '~/routes';
import styles from './LoginPage.module.scss';

export function LoginPage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  function handleLogin() {
    //TODO: add function logic
  }

  return (
    <div className={styles.container}>
      <div className={styles.content_container}>
        <h1 className={styles.header_text}>Logg inn som intern</h1>
        <InputField
          className={styles.input_field}
          placeholder="E-post eller medlemsnummer"
          onChange={(e) => setName(e ? e.currentTarget.value : '')}
        />
        <InputField
          className={styles.input_field}
          placeholder="Passord"
          type="password"
          onChange={(e) => setPassword(e?.currentTarget.value || '')}
        />
        <Button className={styles.login_button} onClick={handleLogin} theme="samf">
          Logg inn
        </Button>
        <Link to={ROUTES.frontend.signup} className={styles.forgotten_password}>
          Glemt passordet ditt?
        </Link>
      </div>
    </div>
  );
}
