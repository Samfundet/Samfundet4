import classNames from 'classnames';
import type React from 'react';
import styles from './H1.module.scss';

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}

export function H1({ className, ...props }: Props) {
  return <h1 className={classNames(styles.header, className)} {...props} />;
}
