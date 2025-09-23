import type { FC } from 'react';
import { Link } from 'react-router';
import { Page } from '~/Components';
import { SAMF3_LOGIN_URL } from '~/routes/samf-three';
import styles from './LoginPickerPage.module.scss';

type Props = {
  newRoute: string;
};

/**
 * A page that allows users to choose between the old and new samf login.
 *
 * @param newRoute for the new samf login (samf4)
 * @constructor
 */
export const LoginPickerPage: FC<Props> = ({ newRoute }) => {
  return (
    <Page>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Logg inn</h1>
          <p>Velg hvilket system du vil logge inn på</p>
        </header>

        <nav aria-label="Velg innlogging" className={styles.picker}>
          <div className={styles.choiceWrapper}>
            <p className={styles.description}>
              For å redigere arrangementer, administrere grupper, og andre administrative oppgaver
            </p>
            <a href={SAMF3_LOGIN_URL.login} className={styles.choice} role="button" aria-label="Gamle samf (samf3)">
              <h3>Gamle samf (samf3)</h3>
            </a>
          </div>

          <div className={styles.choiceWrapper}>
            <p className={styles.description}>Den nye plattformen for generell bruk</p>
            <Link to={newRoute} className={styles.choice} role="button" aria-label="Ny samf (samf4)">
              <h3>Ny samf (samf4)</h3>
            </Link>
          </div>
        </nav>
      </div>
    </Page>
  );
};
