import classNames from 'classnames';
import type React from 'react';
import styles from './H6.module.scss';

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}

export function H6({ className, ...props }: Props) {
  return <h6 className={classNames(styles.header, className)} {...props} />;
}
