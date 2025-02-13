import classNames from 'classnames';
import type { Children } from '~/types';
import styles from './Page.module.scss';

type PageProps = {
  className?: string;
  children?: Children;
};

/**
 * Page component for general styling of padding margin and such
 * Could be implemented with border art, and default values such as fonts
 */
export function Page({ children, className }: PageProps) {
  return <div className={classNames(styles.page, className)}>{children}</div>;
}
