import { useTranslation } from 'react-i18next';
import { englishFlag, norwegianFlag } from '~/assets';
import { LOCALSTORAGE_KEY } from '~/i18n/i18n';
import { LANGUAGES } from '~/i18n/types';
import styles from './LanguageButton.module.scss';

export function LanguageButton() {
  const { i18n } = useTranslation();

  // Language
  const currentLanguage = i18n.language;
  const isNorwegian = currentLanguage === LANGUAGES.NB;
  const otherLanguage = isNorwegian ? LANGUAGES.EN : LANGUAGES.NB;
  const otherFlag = isNorwegian ? englishFlag : norwegianFlag;

  return (
    <button
      type="button"
      className={styles.language_flag_button}
      onClick={() => {
        i18n.changeLanguage(otherLanguage).then();
        localStorage.setItem(LOCALSTORAGE_KEY, otherLanguage);
      }}
    >
      <img src={otherFlag} className={styles.language_flag} alt="Flag" />
    </button>
  );
}
