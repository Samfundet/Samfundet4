import classNames from 'classnames';
import styles from './H4.module.scss';
import React from 'react';

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}

export function H4({ className, ...props }: Props) {
  return <h4 className={classNames(styles.header, className)} {...props} />;
}
