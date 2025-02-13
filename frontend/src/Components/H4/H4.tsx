import classNames from 'classnames';
import type React from 'react';
import styles from './H4.module.scss';

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}

export function H4({ className, ...props }: Props) {
  return <h4 className={classNames(styles.header, className)} {...props} />;
}
