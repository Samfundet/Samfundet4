import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Text } from '~/Components';
import {
  getRecruitmentApplicationsForRecruitmentPosition,
  getRecruitmentPosition,
  updateRecruitmentApplicationStateForPosition,
} from '~/api';
import type { RecruitmentApplicationDto, RecruitmentApplicationStateDto } from '~/dto';
import { useCustomNavigate, useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT, lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './RecruitmentPositionOverviewPage.module.scss';
import { ProcessedApplicants, RecruitmentApplicantsStatus } from './components';

// Define the possible states an application can be in within the recruitment process
// Applications flow through these states as they are processed by recruiters
// TODO add backend to fetch these. ISSUE #1575
const APPLICATION_CATEGORY = ['unprocessed', 'withdrawn', 'hardtoget', 'rejected', 'accepted'] as const;
type ApplicationCategory = (typeof APPLICATION_CATEGORY)[number];

// Define query keys for React Query cache management
// These keys are used to organize and invalidate cached data efficiently
const queryKeys = {
  applications: (positionId: string, type: ApplicationCategory) => ['applications', positionId, type] as const,
  position: (positionId: string) => ['position', positionId] as const,
};

export function RecruitmentPositionOverviewPage() {
  const { recruitmentId, gangId, positionId } = useParams();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useCustomNavigate();

  // Track which application is currently being updated to show loading state
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Validate required URL parameters
  if (!positionId || !recruitmentId || !gangId) {
    toast.error(t(KEY.common_something_went_wrong));
    navigate({ url: -1 });
    return null;
  }

  // Fetch details about the recruitment position
  const positionQuery = useQuery({
    queryKey: queryKeys.position(positionId),
    queryFn: () => getRecruitmentPosition(positionId),
  });

  // Fetch all applications for each possible application state in parallel
  // This allows us to show all categories of applications simultaneously
  const applicationQueries = useQueries({
    queries: APPLICATION_CATEGORY.map((type) => ({
      queryKey: queryKeys.applications(positionId, type),
      queryFn: () => getRecruitmentApplicationsForRecruitmentPosition(positionId, type),
      enabled: !!positionId,
    })),
  });

  const isLoading = applicationQueries.some((query) => query.isLoading) || positionQuery.isLoading;

  // Organize application data by category for easier access
  const applications = Object.fromEntries(
    applicationQueries.map((query, index) => [APPLICATION_CATEGORY[index], query.data || []]),
  ) as Record<ApplicationCategory, RecruitmentApplicationDto[]>;

  // Handle updating application states with optimistic updates
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: RecruitmentApplicationStateDto }) =>
      updateRecruitmentApplicationStateForPosition(id, data),
    // Optimistically update the UI before the server responds
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries();

      // Store the current state to roll back if the mutation fails
      const previousData: Partial<Record<ApplicationCategory, RecruitmentApplicationDto[]>> = {};

      // Save current state for all application categories
      for (const type of APPLICATION_CATEGORY) {
        const queryData = queryClient.getQueryData<RecruitmentApplicationDto[]>(
          queryKeys.applications(positionId, type),
        );
        if (queryData) {
          previousData[type] = queryData;
        }
      }
      // Optimistically update all relevant queries
      for (const type of APPLICATION_CATEGORY) {
        queryClient.setQueryData<RecruitmentApplicationDto[]>(queryKeys.applications(positionId, type), (old) => {
          if (!old) return [];
          return old.map((application) => (application.id === id ? { ...application, ...data } : application));
        });
      }

      return { previousData };
    },
    // If mutation fails, roll back to the previous state
    onError: (_, __, context) => {
      if (context?.previousData) {
        for (const type of APPLICATION_CATEGORY) {
          const previousTypeData = context.previousData[type];
          if (previousTypeData) {
            queryClient.setQueryData(queryKeys.applications(positionId, type), previousTypeData);
          }
        }
      }
      toast.error(t(KEY.common_something_went_wrong));
    },
    // On successful mutation, invalidate and refetch all application queries
    onSuccess: () => {
      for (const type of APPLICATION_CATEGORY) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.applications(positionId, type),
        });
      }
    },
  });

  // Wrapper function to update application state with loading indicator
  const updateApplicationState = (id: string, data: RecruitmentApplicationStateDto) => {
    setUpdatingId(id);
    updateMutation.mutate(
      { id, data },
      {
        onSettled: () => {
          setUpdatingId(null);
        },
      },
    );
  };

  // Define sections for different application categories with their respective texts
  const applicationSections = [
    {
      type: 'accepted' as const,
      title: KEY.recruitment_accepted_applications,
      helpText: KEY.recruitment_accepted_applications_help_text,
      emptyText: KEY.recruitment_accepted_applications_empty_text,
    },
    {
      type: 'rejected' as const,
      title: KEY.recruitment_rejected_applications,
      helpText: KEY.recruitment_rejected_applications_help_text,
      emptyText: KEY.recruitment_rejected_applications_empty_text,
    },
    {
      type: 'hardtoget' as const,
      title: KEY.recruitment_hardtoget_applications,
      helpText: KEY.recruitment_hardtoget_applications_help_text,
      emptyText: KEY.recruitment_hardtoget_applications_empty_text,
    },
    {
      type: 'withdrawn' as const,
      title: KEY.recruitment_withdrawn_applications,
      helpText: '',
      emptyText: KEY.recruitment_withdrawn_applications_empty_text,
    },
  ];

  const title = t(KEY.recruitment_administrate_applications);
  useTitle(title);
  const headerTitle = `${t(KEY.recruitment_administrate_applications)} for  ${positionQuery.data ? dbT(positionQuery.data?.data, 'name') : 'N/A'}`;

  const header = (
    <Button
      theme="success"
      rounded={true}
      link={reverse({
        pattern: ROUTES.frontend.admin_recruitment_gang_position_overview,
        urlParams: { gangId, recruitmentId },
      })}
    >
      {t(KEY.common_go_back)}
    </Button>
  );

  return (
    <AdminPageLayout title={headerTitle} header={header} loading={isLoading}>
      <Text size="l" as="strong" className={styles.subHeader}>
        {lowerCapitalize(t(KEY.recruitment_unprocessed_applicants))} ({applications.unprocessed?.length || 0})
      </Text>

      <RecruitmentApplicantsStatus
        updatingId={updatingId}
        applicants={applications.unprocessed || []}
        recruitmentId={recruitmentId}
        gangId={gangId}
        positionId={positionId}
        updateStateFunction={updateApplicationState}
        onInterviewChange={() => {
          for (const type of APPLICATION_CATEGORY) {
            queryClient.invalidateQueries({
              queryKey: queryKeys.applications(positionId, type),
            });
          }
        }}
      />

      {applicationSections.map(({ type, title, helpText, emptyText }) => (
        <div key={type} className={styles.sub_container}>
          <Text size="l" as="strong" className={styles.subHeader}>
            {t(title)} ({applications[type]?.length || 0})
          </Text>
          {helpText && <Text className={styles.subText}>{t(helpText)}</Text>}
          {applications[type]?.length > 0 ? (
            <ProcessedApplicants
              data={applications[type]}
              type={type}
              revertStateFunction={type !== 'withdrawn' ? updateApplicationState : undefined}
            />
          ) : (
            <Text as="i" className={styles.subText}>
              {t(emptyText)}
            </Text>
          )}
        </div>
      ))}
    </AdminPageLayout>
  );
}
