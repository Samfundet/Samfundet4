import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import { getInformationPage } from '~/api';
import { Link, SamfundetLogoSpinner } from '~/Components';
import { Page } from '~/Components/Page';
import { InformationPageDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { getTranslatedText } from '~/Pages/InformationPage/utils';
import { ROUTES } from '~/routes';

import styles from './InformationPage.module.scss';

/**
 * Page to render all components for easy overview and debug purposes.
 * Useful when styling global themes.
 */
export function InformationPage() {
  const [page, setPage] = useState<InformationPageDto>();
  const { i18n } = useTranslation();
  const { slugField } = useParams();

  // Stuff to do on first render.
  useEffect(() => {
    if (slugField) {
      getInformationPage(slugField)
        .then((data) => setPage(data))
        .catch((data) => {
          console.error(data);
        });
    }
  }, [slugField]);

  const text = getTranslatedText(page, i18n.language);

  if (!page) {
    return (
      <Page>
        <div className={styles.spinner}>
          <SamfundetLogoSpinner />
        </div>
      </Page>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Link
        url={reverse({ pattern: ROUTES.frontend.information_page_edit, urlParams: { slugField: page?.slug_field } })}
      >
        {t(KEY.common_edit)}
      </Link>
      <ReactMarkdown className={styles.md}>{text || ''}</ReactMarkdown>
    </div>
  );
}
