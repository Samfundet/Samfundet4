import { Icon } from '@iconify/react';
import { Button } from '~/Components';
import styles from './ControlPriorityButtons.module.scss';

type ControlPriorityButtonsProps = {
  id: string;
  recruitmentId?: string;
  isFirstItem?: boolean;
  isLastItem?: boolean;
  onPriorityChange: (id: string, direction: 'up' | 'down') => void;
  isPending: boolean;
};

export function ControlPriorityButtons({
  id,
  isFirstItem = false,
  isLastItem = false,
  onPriorityChange,
  isPending,
}: ControlPriorityButtonsProps) {
  return (
    <div className={styles.priorityControllBtnWrapper}>
      {!isFirstItem && (
        <Button display="pill" theme="outlined" onClick={() => onPriorityChange(id, 'up')} disabled={isPending}>
          <Icon
            icon="material-symbols:keyboard-arrow-up-rounded"
            className={styles.priorityControllArrow}
            width={'1.5rem'}
          />
        </Button>
      )}
      {!isLastItem && (
        <Button display="pill" theme="outlined" onClick={() => onPriorityChange(id, 'down')} disabled={isPending}>
          <Icon
            icon="material-symbols:keyboard-arrow-down-rounded"
            className={styles.priorityControllArrow}
            width={'1.5rem'}
          />
        </Button>
      )}
    </div>
  );
}
