import { Icon } from '@iconify/react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link, Page } from '~/Components';
import { ROUTES } from '~/routes';
import styles from './LoginPickerPage.module.scss';

/**
 * A page that allows users to choose between the old and new samf login.
 *
 * @param newRoute for the new samf login (samf4)
 * @constructor
 */
export const LoginPickerPage: FC = () => {
  const navigate = useNavigate();

  return (
    <Page>
      <div className={styles.container}>
        <button type="button" className={styles.backLink} onClick={() => navigate(ROUTES.frontend.home)}>
          <Icon icon="mdi:chevron-left" className={styles.backIcon} />
          Hjem
        </button>

        <div className={styles.formWrapper}>
          <span className={styles.caption}>Innlogging for interne</span>
          <h1 className={styles.headerTitle}>Hvordan vil du logge inn?</h1>

          <nav aria-label="Velg innlogging" className={styles.picker}>
            <Link url={ROUTES.frontend.new_login} className={styles.choiceWrapper}>
              <div className={styles.textWrapper}>
                <span className={styles.radioLabel}>Ny plattform (samf4)</span>
                <p className={styles.description}>Den nye plattformen for arrangementer og generell bruk</p>
              </div>
              <Icon icon="mdi:arrow-right" className={styles.arrowIcon} />
            </Link>

            <Link url={ROUTES.samfThree.controllPanel} target="samf3" className={styles.choiceWrapper}>
              <div className={styles.textWrapper}>
                <span className={styles.radioLabel}>Eldre plattform (samf3)</span>
                <p className={styles.description}>Gruppeadministrasjon og andre administrative oppgaver</p>
              </div>
              <Icon icon="mdi:arrow-right" className={styles.arrowIcon} />
            </Link>
          </nav>
        </div>
      </div>
    </Page>
  );
};
