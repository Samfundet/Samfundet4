import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Button, Table } from '~/Components';
import {
  getRecruitmentApplicationsForApplicant,
  putRecruitmentPriorityForUser,
  withdrawRecruitmentApplicationApplicant,
} from '~/api';
import type { RecruitmentApplicationDto, UserPriorityDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { applicationKeys, withdrawnApplicationKeys } from '~/queryKeys';
import { niceDateTime } from '~/utils';
import { ActiveApplicationLink } from './ActiveApplicationLink';
import { ControlPriorityButtons } from './ControlPriorityButtons';

export type PriorityChangeType = {
  id: string;
  direction: 'up' | 'down';
  successful: boolean;
};

type ActiveApplicationsProps = {
  recruitmentId?: string;
};

export function ActiveApplications({ recruitmentId }: ActiveApplicationsProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [changedApplicationIds, setChangedApplicationIds] = useState<Record<string, 'up' | 'down'>>({});

  // Query for fetching applications
  const { data: applications } = useQuery({
    queryKey: applicationKeys.all,
    queryFn: () => getRecruitmentApplicationsForApplicant(recruitmentId as string),
    enabled: !!recruitmentId,
    initialData: [],
  });

  const handlePriorityChange = (id: string, direction: 'up' | 'down') => {
    priorityMutation.mutate({ id, direction });
  };

  // Mutation for changing priority
  const priorityMutation = useMutation({
    mutationFn: ({ id, direction }: Omit<PriorityChangeType, 'successful'>) => {
      const data: UserPriorityDto = { direction: direction === 'up' ? 1 : -1 };
      return putRecruitmentPriorityForUser(id, data);
    },
    // In your mutation success handler:
    onSuccess: (response) => {
      // Get previous applications data
      const previousApplications = queryClient.getQueryData<RecruitmentApplicationDto[]>(applicationKeys.all) || [];

      // Get new applications data
      const newApplications = response.data;

      // Find out which applications changed priority
      const changes: Record<string, 'up' | 'down'> = {};

      for (const newApp of newApplications) {
        const prevApp = previousApplications.find((app) => app.id === newApp.id);
        if (prevApp && prevApp.applicant_priority !== newApp.applicant_priority) {
          // Priority changed
          changes[newApp.id] = newApp.applicant_priority < prevApp.applicant_priority ? 'up' : 'down';
        }
      }

      // Update the cache with the new data
      queryClient.setQueryData(applicationKeys.all, newApplications);

      // Set the changed applications
      setChangedApplicationIds(changes);

      // Clear the changes after a timeout
      setTimeout(() => {
        setChangedApplicationIds({});
      }, 1000);
    },
    onError: () => {
      toast.error(t(KEY.common_something_went_wrong));
    },
  });

  // Mutation for withdrawing application
  const withdrawMutation = useMutation({
    mutationFn: (positionId: string) => withdrawRecruitmentApplicationApplicant(positionId),
    onSuccess: () => {
      // Invalidate both active and withdrawn applications queries
      queryClient.invalidateQueries({
        queryKey: applicationKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: withdrawnApplicationKeys.all,
      });
    },
    onError: () => {
      toast.error(t(KEY.common_something_went_wrong));
    },
  });

  const withdrawButton = (application: RecruitmentApplicationDto) => {
    return (
      <Button
        theme="samf"
        onClick={() => {
          if (window.confirm(t(KEY.recruitment_withdraw_application))) {
            withdrawMutation.mutate(application.recruitment_position.id.toString());
          }
        }}
      >
        {t(KEY.recruitment_withdraw_application)}
      </Button>
    );
  };

  const filerActiveApplications = (application: RecruitmentApplicationDto) => {
    return application.withdrawn === false;
  };

  const sortedActiveApplications = applications
    .filter(filerActiveApplications)
    .sort((a, b) => a.applicant_priority - b.applicant_priority);

  const tableColumns = [
    // Only include priority column if there are multiple applications
    ...(sortedActiveApplications.length > 1 ? [{ sortable: false, content: t(KEY.recruitment_change_priority) }] : []),
    { sortable: false, content: t(KEY.recruitment_application_for_position) },
    // Only include priority display if there are multiple applications
    ...(sortedActiveApplications.length > 1 ? [{ sortable: false, content: t(KEY.recruitment_your_priority) }] : []),
    { sortable: false, content: t(KEY.recruitment_interview_time) },
    { sortable: false, content: t(KEY.recruitment_interview_location) },
    { sortable: false, content: t(KEY.recruitment_withdraw_application) },
  ];

  const tableRows = sortedActiveApplications.map((application, index) => ({
    cells: [
      // Only include priority arrows if there are multiple applications
      ...(sortedActiveApplications.length > 1
        ? [
            {
              content: (
                <ControlPriorityButtons
                  id={application.id}
                  recruitmentId={recruitmentId}
                  isFirstItem={index === 0}
                  isLastItem={index === sortedActiveApplications.length - 1}
                  onPriorityChange={handlePriorityChange}
                  isPending={priorityMutation.isPending}
                />
              ),
            },
          ]
        : []),
      {
        content: <ActiveApplicationLink application={application} changedApplicationIds={changedApplicationIds} />,
      },
      // Only include priority number if there are multiple applications
      ...(sortedActiveApplications.length > 1
        ? [
            {
              content: application.applicant_priority,
            },
          ]
        : []),
      {
        content: niceDateTime(application.interview?.interview_time) ?? t(KEY.common_not_set),
      },
      {
        content: application.interview?.interview_location ?? t(KEY.common_not_set),
      },
      {
        content: withdrawButton(application),
      },
    ],
  }));

  return (
    <div>
      {sortedActiveApplications.length > 0 ? (
        <Table data={tableRows} columns={tableColumns} />
      ) : (
        <p>{t(KEY.recruitment_not_applied)}</p>
      )}
    </div>
  );
}
