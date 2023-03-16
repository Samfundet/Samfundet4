import { Error } from '~/Components/Error/Error';
import { Link } from '~/Components';
import { SUPPORT_EMAIL } from '~/constants';
import { Page } from '~/Components/Page';
import { KEY } from '~/i18n/constants';
import { useTranslation } from 'react-i18next';
import styles from './NotFoundPage.module.scss';

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <Page>
      <Error header={t(KEY.common_not_found)} message={`${t(KEY.not_found_text)}.`}>
        <p className={styles.contact_prompt}>
          {t(KEY.not_found_contact_prompt)}{' '}
          <Link url={`mailto:${SUPPORT_EMAIL}`} target="email">
            {t(KEY.common_contact_us).toLowerCase()}
          </Link>
          .
        </p>
      </Error>
    </Page>
  );
}
