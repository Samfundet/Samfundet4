import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getInformationPages } from '~/api';
import { Link } from '~/Components';
import { InformationPageDto } from '~/dto';
import { reverse } from '~/named-urls';
import { getTranslatedTitle } from '~/Pages/InformationListPage/utils';
import { ROUTES } from '~/routes';

import { toast } from 'react-toastify';
import { KEY } from '~/i18n/constants';
import styles from './InformationListPage.module.scss';

/**
 * Page to render all components for easy overview and debug purposes.
 * Useful when styling global themes.
 */
export function InformationListPage() {
  const [pages, setPages] = useState<InformationPageDto[]>([]);
  const { i18n, t } = useTranslation();

  // Stuff to do on first render.
  useEffect(() => {
    getInformationPages()
      .then((data) => setPages(data))
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
