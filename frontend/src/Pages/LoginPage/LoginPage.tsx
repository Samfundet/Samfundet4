import { Button } from 'Components';
import { InputField } from 'Components/InputField';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from 'routes';
import styles from './LoginPage.module.scss';

export function LoginPage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  function handleLogin() {
    //TODO: add function logic
  }

  return (
    <div id={styles.container}>
      <div id={styles.content_container}>
        <h1 id={styles.header_text}>Logg inn som intern</h1>
        <InputField
          className={styles.input_field}
          placeholder="E-post eller medlemsnummer"
          onChange={(e: React.FormEvent<HTMLInputElement>) => setName(e.currentTarget.value)}
        />
        <InputField
          className={styles.input_field}
          placeholder="Passord"
          type="password"
          onChange={(e: React.FormEvent<HTMLInputElement>) => setPassword(e.currentTarget.value)}
        />
        <Button className={styles.login_button} onClick={handleLogin}>
          Logg inn
        </Button>
        <Link to={ROUTES.frontend.signup} id={styles.forgotten_password}>
          Glemt passordet ditt?
        </Link>
      </div>
    </div>
  );
}
