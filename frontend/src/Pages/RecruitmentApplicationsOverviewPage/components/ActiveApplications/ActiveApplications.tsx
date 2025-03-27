import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
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
import { applicationKeys } from '~/queryKeys';
import { niceDateTime } from '~/utils';
import type { ApplicantApplicationManagementQK } from '../../RecruitmentApplicationsOverviewPage';
import { ActiveApplicationLink } from './ActiveApplicationLink';
import { ControlPriorityButtons } from './ControlPriorityButtons';

export type PriorityChangeType = {
  id: string;
  direction: 'up' | 'down';
  successful: boolean;
};

type ActiveApplicationsProps = {
  recruitmentId?: string;
  queryKey: ApplicantApplicationManagementQK;
};

export function ActiveApplications({ recruitmentId, queryKey }: ActiveApplicationsProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [recentChanges, setRecentChanges] = useState<PriorityChangeType[]>([]);

  // Clear the recent change after 2 seconds
  useEffect(() => {
    if (recentChanges.length > 0) {
      const timer = setTimeout(() => {
        setRecentChanges([]);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [recentChanges]);

  // Query for fetching applications
  const { data: applications } = useQuery({
    queryKey: applicationKeys.list(recruitmentId),
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
    onSuccess: (response, variables) => {
      // Update the cache with the correct query key
      queryClient.setQueryData(applicationKeys.list(recruitmentId), response.data);

      // Find the clicked application in the response data
      const clickedApp = response.data.find((app) => app.id === variables.id);

      // Find the swapped application - the one that changed position with the clicked app
      const swappedApp = response.data.find(
        (newApp) =>
          clickedApp &&
          newApp.id !== clickedApp.id &&
          ((variables.direction === 'up' && newApp.applicant_priority === clickedApp.applicant_priority + 1) ||
            (variables.direction === 'down' && newApp.applicant_priority === clickedApp.applicant_priority - 1)),
      );

      if (clickedApp && swappedApp) {
        const changes: PriorityChangeType[] = [
          { id: clickedApp.id, direction: variables.direction, successful: true },
          { id: swappedApp.id, direction: variables.direction === 'up' ? 'down' : 'up', successful: true },
        ];
        setRecentChanges(changes);
      }
    },
    onError: () => {
      toast.error(t(KEY.common_something_went_wrong));
      //setRecentChanges([{ id: variables.id, direction: variables.direction, successful: false }]);
    },
  });

  // Mutation for withdrawing application
  const withdrawMutation = useMutation({
    mutationFn: (positionId: string) => withdrawRecruitmentApplicationApplicant(positionId),
    onSuccess: () => {
      // Pass the proper query filter objects
      queryClient.invalidateQueries({
        queryKey: queryKey.applications(recruitmentId as string),
      });
      queryClient.invalidateQueries({
        queryKey: queryKey.withdrawnApplications(recruitmentId as string),
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
                  isPending={priorityMutation.isPaused}
                />
              ),
            },
          ]
        : []),
      {
        content: <ActiveApplicationLink application={application} recentChanges={recentChanges} />,
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
