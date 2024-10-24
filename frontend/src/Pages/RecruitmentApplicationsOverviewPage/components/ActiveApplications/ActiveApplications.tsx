import { Icon } from '@iconify/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Link, Table } from '~/Components';
import {
  getRecruitmentApplicationsForApplicant,
  putRecruitmentPriorityForUser,
  withdrawRecruitmentApplicationApplicant,
} from '~/api';
import type { RecruitmentApplicationDto, UserPriorityDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT, niceDateTime } from '~/utils';
import type { ApplicantApplicationManagementQK } from '../../RecruitmentApplicationsOverviewPage';
import styles from './ActiveApplications.module.scss';

type ActiveApplicationsProps = {
  recruitmentId?: string;
  queryKey: ApplicantApplicationManagementQK;
};
export function ActiveApplications({ recruitmentId, queryKey }: ActiveApplicationsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  // Query for fetching applications
  const { data: applications = [] } = useQuery({
    queryKey: ['applications', recruitmentId],
    queryFn: () => getRecruitmentApplicationsForApplicant(recruitmentId as string).then((response) => response.data),
    enabled: !!recruitmentId,
  });

  // Mutation for changing priority
  const priorityMutation = useMutation({
    mutationFn: ({ id, direction }: { id: string; direction: 'up' | 'down' }) => {
      const data: UserPriorityDto = { direction: direction === 'up' ? 1 : -1 };
      return putRecruitmentPriorityForUser(id, data);
    },
    onSuccess: (response) => {
      // Update the applications in the cache with the new data
      queryClient.setQueryData(['applications', recruitmentId], response.data);
    },
    onError: () => {
      toast.error(t(KEY.common_something_went_wrong));
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

  const handleChangePriority = (id: string, direction: 'up' | 'down') => {
    priorityMutation.mutate({ id, direction });
  };

  const upDownArrow = (id: string) => {
    return (
      <>
        <Icon
          icon="bxs:up-arrow"
          className={styles.arrows}
          width={'1.5rem'}
          onClick={() => handleChangePriority(id, 'up')}
        />
        <Icon
          icon="bxs:down-arrow"
          className={styles.arrows}
          width={'1.5rem'}
          onClick={() => handleChangePriority(id, 'down')}
        />
      </>
    );
  };

  const applicationLink = (application: RecruitmentApplicationDto) => {
    return (
      <Link
        url={reverse({
          pattern: ROUTES.frontend.recruitment_application,
          urlParams: {
            positionID: application.recruitment_position.id,
            gangID: application.recruitment_position.gang.id,
          },
        })}
        className={styles.position_name}
      >
        {dbT(application.recruitment_position, 'name')}
      </Link>
    );
  };

  const withdrawButton = (application: RecruitmentApplicationDto) => {
    return (
      <Button
        theme="samf"
        onClick={() => {
          if (window.confirm(t(KEY.recruitment_withdraw_application))) {
            withdrawMutation.mutate(application.recruitment_position.id);
          }
        }}
      >
        {t(KEY.recruitment_withdraw_application)}
      </Button>
    );
  };
  const tableColumns = [
    // Only include priority column if there are multiple applications
    ...(applications.length > 1 ? [{ sortable: false, content: t(KEY.recruitment_change_priority) }] : []),
    { sortable: false, content: t(KEY.recruitment_position) },
    // Only include priority display if there are multiple applications
    ...(applications.length > 1 ? [{ sortable: false, content: t(KEY.recruitment_your_priority) }] : []),
    { sortable: false, content: t(KEY.recruitment_interview_time) },
    { sortable: false, content: t(KEY.recruitment_interview_location) },
    { sortable: false, content: t(KEY.recruitment_withdraw_application) },
  ];

  const tableRows = applications.map((application) => ({
    cells: [
      // Only include priority arrows if there are multiple applications
      ...(applications.length > 1
        ? [
            {
              content: upDownArrow(application.id),
            },
          ]
        : []),
      {
        content: applicationLink(application),
      },
      // Only include priority number if there are multiple applications
      ...(applications.length > 1
        ? [
            {
              content: application.applicant_priority,
            },
          ]
        : []),
      {
        content: niceDateTime(application.interview?.interview_time) ?? '-',
      },
      {
        content: application.interview?.interview_location ?? '-',
      },
      {
        content: withdrawButton(application),
      },
    ],
  }));

  return (
    <div>
      {applications.length > 0 ? (
        <Table data={tableRows} columns={tableColumns} />
      ) : (
        <p>{t(KEY.recruitment_not_applied)}</p>
      )}
    </div>
  );
}
