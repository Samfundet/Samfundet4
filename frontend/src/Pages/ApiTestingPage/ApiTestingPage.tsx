import { getAllPermissions, getCsrfToken, getUser, login, logout, putUserPreference } from '~/api';
import { Button } from '~/Components';
import { useGlobalContext } from '~/GlobalContextProvider';
import styles from './ApiTestingPage.module.scss';

/**
 * Page to render all components for easy overview and debug purposes.
 * Useful when styling global themes.
 */
export function ApiTestingPage() {
  const { user } = useGlobalContext();
  return (
    <div className={styles.wrapper}>
      <Button theme="samf" className={styles.btn} onClick={() => getCsrfToken().then(console.log).catch(console.error)}>
        getCsrfToken
      </Button>
      <Button
        theme="samf"
        className={styles.btn}
        onClick={() => login('emilte', 'Django123').then(console.log).catch(console.error)}
      >
        login
      </Button>
      <Button theme="samf" className={styles.btn} onClick={() => logout().then(console.log).catch(console.error)}>
        logout
      </Button>
      <Button
        theme="samf"
        className={styles.btn}
        onClick={() => getAllPermissions().then(console.log).catch(console.error)}
      >
        getAllPermissions
      </Button>
      <Button theme="samf" className={styles.btn} onClick={() => getUser().then(console.log).catch(console.error)}>
        getUser
      </Button>
      <Button
        theme="samf"
        className={styles.btn}
        onClick={() => putUserPreference({ id: user?.user_preference.id }).then(console.log).catch(console.error)}
      >
        putUserPreference
      </Button>
    </div>
  );
}
