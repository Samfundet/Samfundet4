import classNames from 'classnames';
import type { ReactNode } from 'react';
import { SamfundetLogoSpinner } from '../SamfundetLogoSpinner';
import styles from './Page.module.scss';

type PageProps = {
  className?: string;
  children?: ReactNode;
  loading?: boolean;
};

/**
 * Page component for general styling of padding margin and such
 * Could be implemented with border art, and default values such as fonts
 */
export function Page({ children, className, loading }: PageProps) {
  if (loading) {
    return (
      <div className={styles.spinner}>
        <SamfundetLogoSpinner />
      </div>
    );
  }
  return <div className={classNames(styles.page, className)}>{children}</div>;
}
