import { Icon } from '@iconify/react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page } from '~/Components';
import { SAMF3_LOGIN_URL } from '~/routes/samf-three';
import styles from './LoginPickerPage.module.scss';

type Props = { newRoute: string };

/**
 * A page that allows users to choose between the old and new samf login.
 *
 * @param newRoute for the new samf login (samf4)
 * @constructor
 */
export const LoginPickerPage: FC<Props> = ({ newRoute }) => {
  const navigate = useNavigate();

  const handleChoice = (choice: 'new' | 'old') => {
    if (choice === 'new') navigate(newRoute);
    else if (choice === 'old') window.location.href = SAMF3_LOGIN_URL.login;
  };

  return (
    <Page>
      <div className={styles.container}>
        <button type="button" className={styles.backLink} onClick={() => navigate(-1)}>
          <Icon icon="mdi:chevron-left" className={styles.backIcon} />
          Tilbake
        </button>

        <div className={styles.formWrapper}>
          <span className={styles.caption}>Innlogging for interne</span>
          <h1 className={styles.headerTitle}>Hvordan vil du logge inn?</h1>

          <div className={styles.picker}>
            <button type="button" className={styles.choiceWrapper} onClick={() => handleChoice('new')}>
              <div className={styles.textWrapper}>
                <span className={styles.radioLabel}>Logg inn på ny plattform (samf4)</span>
                <p className={styles.description}>Den nye plattformen for arrangementer og generell bruk</p>
              </div>
              <Icon icon="mdi:arrow-right" className={styles.arrowIcon} />
            </button>

            <button type="button" className={styles.choiceWrapper} onClick={() => handleChoice('old')}>
              <div className={styles.textWrapper}>
                <span className={styles.radioLabel}>Logg inn på eldre plattform (samf3)</span>
                <p className={styles.description}>Gruppeadministrasjon og andre administrative oppgaver</p>
              </div>
              <Icon icon="mdi:arrow-right" className={styles.arrowIcon} />
            </button>
          </div>
        </div>
      </div>
    </Page>
  );
};
