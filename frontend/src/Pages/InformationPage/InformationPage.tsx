import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import { getInformationPage } from '~/api';
import { SamfundetLogoSpinner } from '~/Components';
import { InformationPageDto } from '~/dto';
import { getTranslatedText } from '~/Pages/InformationPage/utils';

import styles from './InformationPage.module.scss';

/**
 * Page to render all components for easy overview and debug purposes.
 * Useful when styling global themes.
 */
export function InformationPage() {
  const [page, setPage] = useState<InformationPageDto>();
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const { i18n } = useTranslation();
  const { slugField } = useParams();

  // Stuff to do on first render.
  useEffect(() => {
    if (slugField) {
      getInformationPage(slugField)
        .then((data) => setPage(data))
        .catch((data) => {
          console.error(data);
          setShowSpinner(true);
        });
    }
  }, [slugField]);

  const text = getTranslatedText(page, i18n.language);

  if (showSpinner) {
    return (
      <div className={styles.spinner}>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <ReactMarkdown>{text || ''}</ReactMarkdown>
    </div>
  );
}
