import styles from '~/Pages/RecruitmentPage/RecruitmentPage.module.scss';
import { useTextItem } from '~/hooks';
import { TextItem } from '~/constants';
import { ROUTES } from '~/routes';
import { KEY } from '~/i18n/constants';
import { t } from 'i18next';

export function NoPostions() {
  return (
    <div className={styles.no_recruitment_wrapper}>
      <div>
        <h1 className={styles.header}>{useTextItem(TextItem.no_recruitment_text)}</h1>
      </div>

      <div className={styles.info}>
        <p>
          <br />
          {useTextItem(TextItem.no_recruitment_text_0)}
          <br />
          {useTextItem(TextItem.no_recruitment_text_1)}
          <br />
          {useTextItem(TextItem.no_recruitment_text_2)}
          <br />
          <br />
          {useTextItem(TextItem.no_recruitment_text_3)}
          <br />
          {useTextItem(TextItem.no_recruitment_text_4)}{' '}
          <strong>
            <a className={styles.link} href={ROUTES.frontend.contact}>
              {t(KEY.common_click_here)}
            </a>
          </strong>
          <br />
          {useTextItem(TextItem.no_recruitment_text_5)}
        </p>
      </div>
    </div>
  );
}
