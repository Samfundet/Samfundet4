import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Link, Page } from '~/Components';
import { KEY } from '~/i18n/constants';
import { ROUTES_FRONTEND } from '~/routes/frontend';
import { SAMF3_LOGIN_URL } from '~/routes/samf-three';
import styles from './LoginPickerPage.module.scss';

export function LoginPickerPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Page>
      <div className={styles.container}>
        <button type="button" className={styles.backLink} onClick={() => navigate(-1)}>
          <Icon icon="mdi:chevron-left" className={styles.backIcon} />
          {t(KEY.common_go_back)}
        </button>

        <div className={styles.formWrapper}>
          <h1 className={styles.headerTitle}>{t(KEY.loginpicker_page_title)}</h1>
          <p className={styles.page_description}>{t(KEY.loginpicker_page_description)}</p>

          <nav aria-label={t(KEY.loginpicker_page_nav_aria_label)} className={styles.picker}>
            <Link url={ROUTES_FRONTEND.new_login} className={styles.choiceWrapper}>
              <div className={styles.textWrapper}>
                <span className={styles.radioLabel}>{t(KEY.loginpicker_page_new_platform_title)}</span>
                <p className={styles.description}>{t(KEY.loginpicker_page_new_platform_description)}</p>
              </div>
              <Icon icon="mdi:arrow-right" className={styles.arrowIcon} />
            </Link>

            <a href={SAMF3_LOGIN_URL.login} className={styles.choiceWrapper}>
              <div className={styles.textWrapper}>
                <span className={styles.radioLabel}>{t(KEY.loginpicker_page_old_platform_title)}</span>
                <p className={styles.description}>{t(KEY.loginpicker_page_old_platform_description)}</p>
                <p className={styles.description_note}>{t(KEY.loginpicker_page_old_platform_note)}</p>
              </div>
              <Icon icon="mdi:arrow-right" className={styles.arrowIcon} />
            </a>
          </nav>
        </div>
      </div>
    </Page>
  );
}
