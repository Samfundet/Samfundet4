import classNames from 'classnames';
import { Children } from '~/types';
import styles from './Page.module.scss';

type PageProps = {
  classNameInner?: string;
  classNameOuter?: string;
  children?: Children;
};

/**
 * Page component for general styling of padding margin and such
 * Could be implemented with border art, and default values such as fonts
 */
export function Page({ children, classNameInner, classNameOuter }: PageProps) {
  return (
    <div className={classNames(styles.container, classNameOuter)}>
      <div className={classNames(styles.content, classNameInner)}>{children}</div>
    </div>
  );
}
