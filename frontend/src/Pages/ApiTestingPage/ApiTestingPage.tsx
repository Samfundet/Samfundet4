import { Button } from '~/Components';
import {
  assignUserToGroup,
  getApplicantsWithoutInterviews,
  getCsrfToken,
  getInformationPage,
  getInformationPages,
  getRecruitmentApplicationsForApplicant,
  getRecruitmentApplicationsForGang,
  getRecruitmentPosition,
  getRecruitmentPositions,
  getUser,
  getVenue,
  getVenues,
  login,
  logout,
} from '~/api';

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
        onClick={() => login('admin', 'Django123').then(console.log).catch(console.error)}
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
      <Button
        theme="samf"
        className={styles.btn}
        onClick={() => assignUserToGroup('testuser', 'testgroup').then(console.log).catch(console.error)}
      >
        getInformationPage
      </Button>
      <Button
        theme="samf"
        className={styles.btn}
        onClick={() => getRecruitmentPositions('1').then(console.log).catch(console.error)}
      >
        get Rec pos
      </Button>
      <Button
        theme="samf"
        className={styles.btn}
        onClick={() => getRecruitmentPosition('1').then(console.log).catch(console.error)}
      >
        get Rec pos
      </Button>

      <Button
        theme="samf"
        className={styles.btn}
        onClick={() => getRecruitmentApplicationsForApplicant('1').then(console.log).catch(console.error)}
      >
        get Rec applications for user
      </Button>

      <Button
        theme="samf"
        className={styles.btn}
        onClick={() => getRecruitmentApplicationsForGang('1', '1').then(console.log).catch(console.error)}
      >
        get Rec applications for gang
      </Button>
      <Button
        theme="samf"
        className={styles.btn}
        onClick={() => getApplicantsWithoutInterviews('1').then(console.log).catch(console.error)}
      >
        get users without interviews
      </Button>
    </div>
  );
}
