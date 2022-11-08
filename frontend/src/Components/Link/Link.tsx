import classNames from 'classnames';
import { Children } from '~/types';
import styles from './Link.module.scss';

type LinkProps = {
  className?: string;
  underline?: boolean;
  url?: string;
  children?: Children;
};

export function Link({ underline, className, children, url }: LinkProps) {
  return (
    <a
      className={classNames(className, {
        [styles.underline]: underline,
        [styles.regular]: !underline,
      })}
      href={url}
    >
      {children}
    </a>
  );
}
