import {
  getCsrfToken,
  getInformationPage,
  getInformationPages,
  getUser,
  getVenue,
  getVenues,
  login,
  logout,
} from '~/api';
import { Button } from '~/Components';

import styles from './ApiTestingPage.module.scss';

/**
 * Page to render all components for easy overview and debug purposes.
 * Useful when styling global themes.
 */
export function ApiTestingPage() {
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
      <Button theme="samf" className={styles.btn} onClick={() => getUser().then(console.log).catch(console.error)}>
        getUser
      </Button>
      <Button theme="samf" className={styles.btn}>
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
