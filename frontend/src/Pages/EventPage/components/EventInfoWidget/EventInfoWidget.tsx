import { Icon } from '@iconify/react';
import type { ReactNode } from 'react';
import { Text } from '~/Components';
import styles from './EventInfoWidget.module.scss';

type EventInfoWidgetProps = {
  icon: string;
  info: string | number | ReactNode;
};

export function EventInfoWidget({ icon, info }: EventInfoWidgetProps) {
  return (
    <div className={styles.widget_wrapper}>
      <div className={styles.widget_content}>
        <Icon icon={icon} className={styles.widget_icon} width="1.25rem" />
        <Text as="strong" className={styles.widget_info}>
          {info}
        </Text>
      </div>
    </div>
  );
}
