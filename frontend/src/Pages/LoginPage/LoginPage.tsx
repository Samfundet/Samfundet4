import { Button } from 'Components';
import { InputField } from 'Components/InputField';
import { Link } from 'react-router-dom';
import { ROUTES } from 'routes';
import styles from './LoginPage.module.scss';

export function LoginPage() {
  return (
    <div id={styles.container}>
      <div id={styles.content_container}>
        <h1 id={styles.header_text}>Logg inn som intern</h1>
        <InputField className={styles.input_field} />
        <InputField className={styles.input_field} />
        <Button className={styles.login_button}>Logg inn</Button>
        <Link to={ROUTES.frontend.signup} id={styles.forgotten_password}>
          Glemt passordet ditt?
        </Link>
      </div>
    </div>
  );
}
