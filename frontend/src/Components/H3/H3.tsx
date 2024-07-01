import classNames from 'classnames';
import styles from './H3.module.scss';
import React from 'react';

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}

export function H3({ className, ...props }: Props) {
  return <h3 className={classNames(styles.header, className)} {...props} />;
}
