import classNames from 'classnames';
import styles from './H6.module.scss';
import React from 'react';

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}

export function H6({ className, ...props }: Props) {
  return <h6 className={classNames(styles.header, className)} {...props} />;
}
