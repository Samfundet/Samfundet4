import type { ReactNode } from 'react';
import styles from './Subscription.module.scss';

type SubscriptionProps = {
  title: string;
  actions?: ReactNode;
  children?: ReactNode;
};

export function Subscription({ title, actions, children }: SubscriptionProps) {
  return (
    <div className={styles.subscription}>
      <div className={styles.row}>
        <h3 className={styles.subscriptionTitle}>{title}</h3>
        {actions}
      </div>
      {children}
    </div>
  );
}
