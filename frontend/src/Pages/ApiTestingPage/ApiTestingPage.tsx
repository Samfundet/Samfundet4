import {
  getAllPermissions,
  getCsrfToken,
  getInformationPage,
  getInformationPages,
  getUser,
  getVenue,
  getVenues,
  login,
  logout,
  putUserPreference,
} from '~/api';
import { useAuthContext } from '~/AuthContext';
import { Button } from '~/Components';

import styles from './ApiTestingPage.module.scss';

/**
 * Page to render all components for easy overview and debug purposes.
 * Useful when styling global themes.
 */
export function ApiTestingPage() {
  const { user } = useAuthContext();
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
      <Button theme="samf" className={styles.btn} onClick={() => getVenues().then(console.log).catch(console.error)}>
        getVenues
      </Button>
      <Button theme="samf" className={styles.btn} onClick={() => getVenue(1).then(console.log).catch(console.error)}>
        getVenue
      </Button>
      <Button
        theme="samf"
        className={styles.btn}
        onClick={() => getInformationPages().then(console.log).catch(console.error)}
      >
        getInformationPages
      </Button>
      <Button
        theme="samf"
        className={styles.btn}
        onClick={() => getInformationPage('test').then(console.log).catch(console.error)}
      >
        getInformationPage
      </Button>
    </div>
  );
}
