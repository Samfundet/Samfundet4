import classNames from 'classnames';
import styles from './H5.module.scss';
import React from 'react';

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}

export function H5({ className, ...props }: Props) {
  return <h5 className={classNames(styles.header, className)} {...props} />;
}
