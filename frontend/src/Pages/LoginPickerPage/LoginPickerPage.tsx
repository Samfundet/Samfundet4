import { FC, useState, FormEvent } from 'react';
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
  const [choice, setChoice] = useState('');
  const navigate = useNavigate();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (choice === 'new') navigate(newRoute);
    else if (choice === 'old') window.location.href = SAMF3_LOGIN_URL.login;
  };

  return (
    <Page>
      <div className={styles.container}>
        <form onSubmit={onSubmit} className={styles.formWrapper}>
          <h1 className={styles.headerTitle}>Hvordan vil du logge inn?</h1>

          <div className={styles.picker}>
            <div className={styles.choiceWrapper}>
              <input
                type="radio"
                id="n"
                name="c"
                value="new"
                onChange={() => setChoice('new')}
                className={styles.radioInput}
              />
              <label htmlFor="n" className={styles.radioLabel}>
                Logg inn på ny plattform (samf4)
              </label>
              <p className={styles.description}>Brukes for arrangementer og generell bruk</p>
            </div>

            <div className={styles.choiceWrapper}>
              <input
                type="radio"
                id="o"
                name="c"
                value="old"
                onChange={() => setChoice('old')}
                className={styles.radioInput}
              />
              <label htmlFor="o" className={styles.radioLabel}>
                Logg inn på eldre plattform (samf3)
              </label>
              <p className={styles.description}>Brukes for å administrere grupper og andre administrative oppgaver</p>
            </div>
          </div>

          <button type="submit" className={styles.button}>
            Fortsett
          </button>
        </form>
      </div>
    </Page>
  );
};
