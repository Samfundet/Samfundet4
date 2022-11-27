import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getInformationPages } from '~/api';
import { Link } from '~/Components';
import { InformationPageDto } from '~/dto';
import { reverse } from '~/named-urls';
import { getTranslatedTitle } from '~/Pages/InformationListPage/utils';
import { ROUTES } from '~/routes';

import styles from './InformationListPage.module.scss';

/**
 * Page to render all components for easy overview and debug purposes.
 * Useful when styling global themes.
 */
export function InformationListPage() {
  const [pages, setPages] = useState<InformationPageDto[]>([]);
  const { i18n } = useTranslation();

  // Stuff to do on first render.
  useEffect(() => {
    getInformationPages()
      .then((data) => setPages(data))
      .catch(console.error);
  }, []);

  return (
    <div className={styles.wrapper}>
      {pages.map((page, i) => {
        return (
          <Link
            key={i}
            url={reverse({
              pattern: ROUTES.frontend.information_page_detail,
              urlParams: { slugField: page.slug_field },
            })}
          >
            {page.slug_field}
            {getTranslatedTitle(page, i18n.language)}
          </Link>
        );
      })}
    </div>
  );
}
