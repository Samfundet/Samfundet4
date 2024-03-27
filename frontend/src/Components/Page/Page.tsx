import classNames from 'classnames';
import { Children } from '~/types';
import styles from './Page.module.scss';
import { SamfundetLogoSpinner } from '../SamfundetLogoSpinner';

type PageProps = {
  className?: string;
  children?: Children;
  loading?: boolean;
};

/**
 * Page component for general styling of padding margin and such
 * Could be implemented with border art, and default values such as fonts
 */
export function Page({ children, className, loading = false }: PageProps) {
  if (loading) {
    return (
      <div className={styles.spinner}>
        <SamfundetLogoSpinner />
      </div>
    );
  }
  return <div className={classNames(styles.page, className)}>{children}</div>;
}
