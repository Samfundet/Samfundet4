import { Icon } from '@iconify/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Button } from '~/Components';
import { putRecruitmentPriorityForUser } from '~/api';
import type { RecruitmentApplicationDto, UserPriorityDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { applicationKeys } from '~/queryKeys';
import styles from './ControlPriorityButtons.module.scss';

export type PriorityChange = {
  id: string;
  direction: 'up' | 'down';
  successful: boolean;
};

type ControlPriorityButtonsProps = {
  id: string;
  recruitmentId?: string;
  isFirstItem?: boolean;
  isLastItem?: boolean;
  onPriorityChange?: (changes: PriorityChange[]) => void;
};

export function ControlPriorityButtons({
  id,
  recruitmentId,
  isFirstItem = false,
  isLastItem = false,
  onPriorityChange,
}: ControlPriorityButtonsProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Mutation for changing priority
  const priorityMutation = useMutation({
    mutationFn: ({ id, direction }: Omit<PriorityChange, 'successful'>) => {
      const data: UserPriorityDto = { direction: direction === 'up' ? 1 : -1 };
      return putRecruitmentPriorityForUser(id, data);
    },
    onSuccess: (response, variables) => {
      const oldData = queryClient.getQueryData<RecruitmentApplicationDto[]>(['applications', recruitmentId]);
      applicationKeys.list(recruitmentId);
      queryClient.setQueryData(applicationKeys.list(recruitmentId), response.data);

      // Only update state if we have the data and the callback
      if (oldData && onPriorityChange) {
        const clickedApp = oldData.find((app) => app.id === variables.id);
        const swappedApp = response.data.find(
          (newApp) =>
            clickedApp && newApp.applicant_priority === clickedApp.applicant_priority && newApp.id !== clickedApp.id,
        );

        if (clickedApp && swappedApp) {
          const changes: PriorityChange[] = [
            { id: clickedApp.id, direction: variables.direction, successful: true },
            { id: swappedApp.id, direction: variables.direction === 'up' ? 'down' : 'up', successful: true },
          ];
          onPriorityChange(changes);
        }
      }
    },
    onError: () => {
      toast.error(t(KEY.common_something_went_wrong));
      if (onPriorityChange) {
        onPriorityChange([{ id, direction: 'up', successful: false }]);
      }
    },
  });

  const handleChangePriority = (id: string, direction: 'up' | 'down') => {
    priorityMutation.mutate({ id, direction });
  };

  return (
    <div className={styles.priorityControllBtnWrapper}>
      {!isFirstItem && (
        <Button
          display="pill"
          theme="outlined"
          onClick={() => handleChangePriority(id, 'up')}
          disabled={priorityMutation.isPending}
        >
          <Icon
            icon="material-symbols:keyboard-arrow-up-rounded"
            className={styles.priorityControllArrow}
            width={'1.5rem'}
          />
        </Button>
      )}
      {!isLastItem && (
        <Button
          display="pill"
          theme="outlined"
          onClick={() => handleChangePriority(id, 'down')}
          disabled={priorityMutation.isPending}
        >
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
