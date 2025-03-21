import { Icon } from '@iconify/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Button } from '~/Components';
import { putRecruitmentPriorityForUser } from '~/api';
import type { RecruitmentApplicationDto, UserPriorityDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import styles from './ControlPriorityButtons.module.scss';

export type PriorityChange = {
  id: string;
  direction: 'up' | 'down';
};

type ControlPriorityButtonsProps = {
  id: string;
  recruitmentId?: string;
  onPriorityChange?: (changes: PriorityChange[]) => void;
};

export function ControlPriorityButtons({ id, recruitmentId, onPriorityChange }: ControlPriorityButtonsProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Mutation for changing priority
  const priorityMutation = useMutation({
    mutationFn: ({ id, direction }: PriorityChange) => {
      const data: UserPriorityDto = { direction: direction === 'up' ? 1 : -1 };
      return putRecruitmentPriorityForUser(id, data);
    },
    onSuccess: (response, variables) => {
      const oldData = queryClient.getQueryData<RecruitmentApplicationDto[]>(['applications', recruitmentId]);
      queryClient.setQueryData(['applications', recruitmentId], response.data);

      if (oldData) {
        const clickedApp = oldData.find((app) => app.id === variables.id);
        const swappedApp = response.data.find(
          (newApp) =>
            clickedApp && newApp.applicant_priority === clickedApp.applicant_priority && newApp.id !== clickedApp.id,
        );

        if (clickedApp && swappedApp && onPriorityChange) {
          const changes: PriorityChange[] = [
            { id: clickedApp.id, direction: variables.direction },
            { id: swappedApp.id, direction: variables.direction === 'up' ? 'down' : 'up' },
          ];
          onPriorityChange(changes);
        }
      }
    },
    onError: () => {
      toast.error(t(KEY.common_something_went_wrong));
    },
  });

  const handleChangePriority = (id: string, direction: 'up' | 'down') => {
    priorityMutation.mutate({ id, direction });
  };

  return (
    <div className={styles.priorityControllBtnWrapper}>
      <Button display="pill" theme="outlined" onClick={() => handleChangePriority(id, 'up')}>
        <Icon
          icon="material-symbols:keyboard-arrow-up-rounded"
          className={styles.priorityControllArrow}
          width={'1.5rem'}
        />
      </Button>
      <Button display="pill" theme="outlined" onClick={() => handleChangePriority(id, 'down')}>
        <Icon
          icon="material-symbols:keyboard-arrow-down-rounded"
          className={styles.priorityControllArrow}
          width={'1.5rem'}
        />
      </Button>
    </div>
  );
}
