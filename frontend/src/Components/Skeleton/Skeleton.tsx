import classNames from 'classnames';
import type { CSSProperties, HTMLAttributes } from 'react';
import styles from './Skeleton.module.scss';

export type SkeletonProps = HTMLAttributes<HTMLDivElement> & CSSProperties;

export function Skeleton({ className, style, ...props }: SkeletonProps) {
  return <div className={classNames(styles.skeleton, className)} style={{ ...(props as CSSProperties), ...style }} />;
}
