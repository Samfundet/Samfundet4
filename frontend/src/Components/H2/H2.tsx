import classNames from 'classnames';
import type React from 'react';
import styles from './H2.module.scss';

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}

export function H2({ className, ...props }: Props) {
  return <h2 className={classNames(styles.header, className)} {...props} />;
}
