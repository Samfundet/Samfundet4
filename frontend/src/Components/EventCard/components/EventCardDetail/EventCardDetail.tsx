import classNames from 'classnames';
import type { HTMLAttributes, ReactNode } from 'react';
import styles from './EventCardDetail.module.scss';

type EventCardDetailContainerProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export function EventCardDetailContainer({ className, ...props }: EventCardDetailContainerProps) {
  return <div className={classNames(styles.detail_container, className)} {...props} />;
}

type EventCardDetailGroupProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export function EventCardDetailGroup({ className, ...props }: EventCardDetailGroupProps) {
  return <div className={classNames(styles.detail_group, className)} {...props} />;
}

type EventCardDetailProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function EventCardDetail({ className, ...props }: EventCardDetailProps) {
  return <div className={classNames(styles.detail, className)} {...props} />;
}
