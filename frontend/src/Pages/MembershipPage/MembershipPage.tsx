import { useTranslation } from 'react-i18next';
import { Page } from '~/Components/Page';
import { TextItem } from '~/constants';
import { useTextItem } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './MembershipPage.module.scss';

export function MembershipPage() {
  const { t } = useTranslation();

  return (
    <Page>
      <div>
        <div className={styles.info}>
          <h1 className={styles.header}> {t(KEY.common_membership)}</h1>
          <div>{useTextItem(TextItem.membership)}</div>
        </div>
        <div className={styles.info}>
          {' '}
          <h2 className={styles.header2}>{useTextItem(TextItem.why_member_header)}</h2>
          <div>{useTextItem(TextItem.why_member_text)}</div>
          <ul className={styles.list}>
            <li className={styles.list_item}>{useTextItem(TextItem.why_member_list_0)}</li>
            <li className={styles.list_item}>{useTextItem(TextItem.why_member_list_1)}</li>
            <li className={styles.list_item}>{useTextItem(TextItem.why_member_list_2)}</li>
            <li className={styles.list_item}>{useTextItem(TextItem.why_member_list_3)}</li>
            <li className={styles.list_item}>{useTextItem(TextItem.why_member_list_4)}</li>
            <li className={styles.list_item}>{useTextItem(TextItem.why_member_list_5)}</li>
            <li className={styles.list_item}>{useTextItem(TextItem.why_member_list_6)}</li>
            <li className={styles.list_item}>{useTextItem(TextItem.why_member_list_7)}</li>
          </ul>
        </div>
        <div className={styles.info}>
          <h2 className={styles.header2}>{useTextItem(TextItem.membership_prices_header)}</h2>
          <ul className={styles.list}>
            <li className={styles.list_item}>{useTextItem(TextItem.membership_prices_0)}</li>
            <li className={styles.list_item}>{useTextItem(TextItem.membership_prices_1)}</li>
            <li className={styles.list_item}>{useTextItem(TextItem.membership_prices_2)}</li>
            <li className={styles.list_item}>{useTextItem(TextItem.membership_prices_3)}</li>
            <li className={styles.list_item}>{useTextItem(TextItem.membership_prices_4)}</li>
            <li className={styles.list_item}>{useTextItem(TextItem.membership_prices_5)}</li>
          </ul>
        </div>
        <div className={styles.info}>
          <h2 className={styles.header2}>{useTextItem(TextItem.who_member_header)}</h2>
          <div>{useTextItem(TextItem.who_member_text)}</div>
          <ul className={styles.list}>
            <li className={styles.list_item}>{useTextItem(TextItem.who_member_list_0)}</li>
            <li className={styles.list_item}>{useTextItem(TextItem.who_member_list_1)}</li>
            <li className={styles.list_item}>{useTextItem(TextItem.who_member_list_2)}</li>
          </ul>
        </div>
        <div className={styles.info}>
          <h2 className={styles.header2}>{useTextItem(TextItem.member_benefits)}</h2>
          <div>{useTextItem(TextItem.member_benefits_text)}</div>
          <ul className={styles.list}>
            <li className={styles.list_item}>{useTextItem(TextItem.member_benefits_list_0)}</li>
            <li className={styles.list_item}>{useTextItem(TextItem.member_benefits_list_1)}</li>
            <li className={styles.list_item}>{useTextItem(TextItem.member_benefits_list_2)}</li>
            <li className={styles.list_item}>{useTextItem(TextItem.member_benefits_list_3)}</li>
          </ul>
        </div>
        <div className={styles.info}>
          <h2 className={styles.header2}>{useTextItem(TextItem.buy_membership)}</h2>
          <div>
            {useTextItem(TextItem.buy_membership_text_0)}{' '}
            <a className={styles.link} href={ROUTES.frontend.luka}>
              {t(KEY.common_here) + '.'}
            </a>
          </div>
          <div>
            {useTextItem(TextItem.buy_membership_text_1)}

            <a className={styles.link} href={ROUTES.other.akademika}>
              {t(KEY.common_here) + '.'}
            </a>
          </div>
          <div>{useTextItem(TextItem.buy_membership_text_2)}</div>
        </div>
        <div className={styles.info}>
          <h2 className={styles.header2}>{useTextItem(TextItem.register_card)}</h2>
          <div>{useTextItem(TextItem.register_card_text)}</div>
        </div>
        <div className={styles.info}>
          <h2 className={styles.header2}>{useTextItem(TextItem.laws_and_statutes_header)}</h2>
          <div>
            {useTextItem(TextItem.laws_and_statutes_text)}{' '}
            <a className={styles.link} href={ROUTES.other.laws_and_statutes}>
              {t(KEY.common_here) + '.'}
            </a>
          </div>
        </div>
      </div>
    </Page>
  );
}
