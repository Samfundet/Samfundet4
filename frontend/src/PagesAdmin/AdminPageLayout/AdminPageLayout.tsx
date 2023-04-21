import { ReactNode } from 'react';
import { IconButton, SamfundetLogoSpinner } from '~/Components';
import { COLORS } from '~/types';
import styles from './AdminPageLayout.module.scss';

type AdminPageLayoutProps = {
  title: string;
  backendUrl?: string;
  header?: ReactNode;
  loading?: boolean;
  children: ReactNode;
}

/**
 * Simple wrapper for admin pages to keep them consistent.
 */
export function AdminPageLayout({ title, backendUrl, header, loading, children }: AdminPageLayoutProps) {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.title_row}>
          <div className={styles.title}>
            {title}
          </div>
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
        <div className={styles.header_container}>
          {header}
        </div>
      </div>
      <div className={styles.content_container}>
        {loading && (
            <div className={styles.spinner_container}>
              <SamfundetLogoSpinner />
            </div>
        )}
        {!loading && children}
      </div>
    </div>
  );
}
