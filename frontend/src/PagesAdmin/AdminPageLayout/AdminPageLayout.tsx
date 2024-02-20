import { ReactNode, useEffect } from 'react';
import { Breadcrumb, IconButton, SamfundetLogoSpinner } from '~/Components';
import { COLORS } from '~/types';
import styles from './AdminPageLayout.module.scss';

type AdminPageLayoutProps = {
  title: string;
  backendUrl?: string;
  header?: ReactNode;
  loading?: boolean;
  children: ReactNode;
};

/**
 * Simple wrapper for admin pages to keep them consistent.
 */
export function AdminPageLayout({ title, backendUrl, header, loading, children }: AdminPageLayoutProps) {
  useEffect(() => {
    // Scroll to top on page change
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className={styles.header}>
        <Breadcrumb></Breadcrumb>
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
        {header && <div className={styles.header_container}>{header}</div>}
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
