import classNames from 'classnames';
import type { ReactNode } from 'react';
import styles from './SultenPage.module.scss';

type PageProps = {
  classNameInner?: string;
  classNameOuter?: string;
  children?: ReactNode;
};

/**
 * Page component for general styling of padding margin and such
 * Could be implemented with border art, and default values such as fonts
 */
export function SultenPage({ children, classNameInner, classNameOuter }: PageProps) {
  return (
    <div className={classNames(styles.container, classNameOuter)}>
      <div className={classNames(styles.content, classNameInner)}>{children}</div>
    </div>
  );
}
