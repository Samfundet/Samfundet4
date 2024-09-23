import { t } from 'i18next';
import { TextItem } from '~/constants';
import { useTextItem } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './NoPositions.module.scss';

export function NoPositions() {
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
