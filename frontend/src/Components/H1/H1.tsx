import classNames from 'classnames';
import styles from './H1.module.scss';
import React from 'react';

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}

export function H1({ className, ...props }: Props) {
  return (
    <h1 className={classNames(styles.header, className)} {...props} />
  );
}
