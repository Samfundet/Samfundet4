import classNames from 'classnames';
import styles from './H2.module.scss';
import React from 'react';

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}

export function H2({ className, ...props }: Props) {
  return (
    <h2 className={classNames(styles.header, className)} {...props} />
  );
}
