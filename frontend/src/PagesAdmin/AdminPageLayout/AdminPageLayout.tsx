import { ReactNode, useEffect } from 'react';
import { Button, IconButton, SamfundetLogoSpinner } from '~/Components';
import { COLORS } from '~/types';
import styles from './AdminPageLayout.module.scss';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';

type AdminPageLayoutProps = {
  title: string;
  backendUrl?: string;
  header?: ReactNode;
  loading?: boolean;
  children: ReactNode;
  showBackButton?: boolean;
};

/**
 * BackButton component to navigate back in the history stack.
 */
const BackButton = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <Button theme="success" rounded={true} onClick={goBack}>
      {t(KEY.common_go_back)}
    </Button>
  );
};

/**
 * Simple wrapper for admin pages to keep them consistent.
 */
export function AdminPageLayout({
  title,
  backendUrl,
  header,
  loading,
  children,
  showBackButton = false,
}: AdminPageLayoutProps) {
  useEffect(() => {
    // Scroll to top on page change
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className={styles.header}>
        <div className={styles.title_row}>
          <div className={styles.title}>{title}</div>
          {backendUrl && (
            <IconButton
              icon="vscode-icons:file-type-django"
              title="Backend details"
              target="backend"
              color={COLORS.white}
              border="solid #444 1px"
              url={backendUrl}
            />
          )}
        </div>
        {header && (
          <div className={styles.header_container}>
            {showBackButton && <BackButton />}
            {header}
          </div>
        )}
      </div>
      <div className={styles.content_container}>
        {loading && (
          <div className={styles.spinner_container}>
            <SamfundetLogoSpinner />
          </div>
        )}
        {!loading && children}
      </div>
    </>
  );
}
