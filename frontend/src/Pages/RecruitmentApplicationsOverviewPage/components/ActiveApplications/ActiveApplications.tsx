import { Icon } from '@iconify/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Button, Link, Table } from '~/Components';
import { getRecruitmentApplicationsForApplicant, withdrawRecruitmentApplicationApplicant } from '~/api';
import type { RecruitmentApplicationDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { COLORS } from '~/types';
import { dbT, niceDateTime } from '~/utils';
import type { ApplicantApplicationManagementQK } from '../../RecruitmentApplicationsOverviewPage';
import { ControlPriorityButton, type PriorityChange } from '../ControlPriorityButton';
import styles from './ActiveApplications.module.scss';

type ActiveApplicationsProps = {
  recruitmentId?: string;
  queryKey: ApplicantApplicationManagementQK;
};

export function ActiveApplications({ recruitmentId, queryKey }: ActiveApplicationsProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [recentChanges, setRecentChanges] = useState<PriorityChange[]>([]);

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
  const { data: applications = [] } = useQuery({
    queryKey: ['applications', recruitmentId],
    queryFn: () => getRecruitmentApplicationsForApplicant(recruitmentId as string).then((response) => response.data),
    enabled: !!recruitmentId,
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

  const applicationLink = (application: RecruitmentApplicationDto) => {
    const change = recentChanges.find((change) => change.id === application.id);

    return (
      <div className={styles.positionLinkWrapper}>
        {change &&
          (change.direction === 'up' ? (
            <Icon
              className={styles.priorityChangeIndicator}
              icon={'material-symbols:arrow-drop-up-rounded'}
              color={COLORS.green_light}
            />
          ) : (
            <Icon
              className={styles.priorityChangeIndicator}
              icon={'material-symbols:arrow-drop-down-rounded'}
              color={COLORS.red_light}
            />
          ))}
        <Link
          url={reverse({
            pattern: ROUTES.frontend.recruitment_application,
            urlParams: {
              recruitmentId: application.recruitment,
              positionId: application.recruitment_position.id,
            },
          })}
          className={styles.positionName}
        >
          {dbT(application.recruitment_position, 'name')}
        </Link>
      </div>
    );
  };

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

  const tableRows = sortedActiveApplications.map((application) => ({
    cells: [
      // Only include priority arrows if there are multiple applications
      ...(sortedActiveApplications.length > 1
        ? [
            {
              content: (
                <ControlPriorityButton
                  id={application.id}
                  recruitmentId={recruitmentId}
                  onPriorityChange={setRecentChanges}
                />
              ),
            },
          ]
        : []),
      {
        content: applicationLink(application),
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
