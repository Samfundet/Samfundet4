import { Icon } from '@iconify/react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Page } from '~/Components';
import { KEY } from '~/i18n/constants';
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
  const { t } = useTranslation();

  return (
    <Page>
      <div className={styles.container}>
        <button type="button" className={styles.backLink} onClick={() => navigate(-1)}>
          <Icon icon="mdi:chevron-left" className={styles.backIcon} />
          {t(KEY.common_go_back)}
        </button>

        <div className={styles.formWrapper}>
          <span className={styles.caption}>{t(KEY.loginpicker_page_caption)}</span>
          <h1 className={styles.headerTitle}>{t(KEY.loginpicker_page_title)}</h1>

          <nav aria-label={t(KEY.loginpicker_page_nav_aria_label)} className={styles.picker}>
            <a href={newRoute} className={styles.choiceWrapper}>
              <div className={styles.textWrapper}>
                <span className={styles.radioLabel}>{t(KEY.loginpicker_page_new_platform_title)}</span>
                <p className={styles.description}>{t(KEY.loginpicker_page_new_platform_description)}</p>
              </div>
              <Icon icon="mdi:arrow-right" className={styles.arrowIcon} />
            </a>

            <a href={SAMF3_LOGIN_URL.login} target="samf3" className={styles.choiceWrapper}>
              <div className={styles.textWrapper}>
                <span className={styles.radioLabel}>{t(KEY.loginpicker_page_old_platform_title)}</span>
                <p className={styles.description}>{t(KEY.loginpicker_page_old_platform_description)}</p>
              </div>
              <Icon icon="mdi:arrow-right" className={styles.arrowIcon} />
            </a>
          </nav>
        </div>
      </div>
    </Page>
  );
};
