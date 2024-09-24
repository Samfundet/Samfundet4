import classNames from 'classnames';
import type React from 'react';
import styles from './H3.module.scss';

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}

export function H3({ className, ...props }: Props) {
  return <h3 className={classNames(styles.header, className)} {...props} />;
}
