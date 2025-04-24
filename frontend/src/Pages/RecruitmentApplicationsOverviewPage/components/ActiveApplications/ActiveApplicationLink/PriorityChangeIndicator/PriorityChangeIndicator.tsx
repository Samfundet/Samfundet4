import { Icon } from '@iconify/react';
import { COLORS } from '~/types';
import styles from './PriorityChangeIndicator.module.scss';

type PriorityChangeIndicatorProps = {
  direction: 'up' | 'down';
};

export function PriorityChangeIndicator({ direction }: PriorityChangeIndicatorProps) {
  return (
    <Icon
      className={styles.priorityChangeIndicator}
      icon={direction === 'up' ? 'material-symbols:arrow-drop-up-rounded' : 'material-symbols:arrow-drop-down-rounded'}
      color={direction === 'up' ? COLORS.green_light : COLORS.red_light}
    />
  );
}
