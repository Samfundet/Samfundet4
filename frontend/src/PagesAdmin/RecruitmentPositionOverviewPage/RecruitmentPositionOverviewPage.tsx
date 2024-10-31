import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, RecruitmentApplicantsStatus, Text } from '~/Components';
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
import { ProcessedApplicants } from './components';

// TODO add backend to fetch these. ISSUE #1575
const APPLICATION_CATEGORY = ['unprocessed', 'withdrawn', 'hardtoget', 'rejected', 'accepted'] as const;
type ApplicationCategory = (typeof APPLICATION_CATEGORY)[number];

const queryKeys = {
  applications: (positionId: string, type: ApplicationCategory) => ['applications', positionId, type] as const,
  position: (positionId: string) => ['position', positionId] as const,
};

export function RecruitmentPositionOverviewPage() {
  const { recruitmentId, gangId, positionId } = useParams();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useCustomNavigate();

  if (!positionId || !recruitmentId || !gangId) {
    toast.error(t(KEY.common_something_went_wrong));
    navigate({ url: -1 });
    return null;
  }

  // Query for position details
  const positionQuery = useQuery({
    queryKey: queryKeys.position(positionId),
    queryFn: () => getRecruitmentPosition(positionId),
  });

  // Queries for applications
  const applicationQueries = useQueries({
    queries: APPLICATION_CATEGORY.map((type) => ({
      queryKey: queryKeys.applications(positionId, type),
      queryFn: () => getRecruitmentApplicationsForRecruitmentPosition(positionId, type),
      enabled: !!positionId,
    })),
  });

  const isLoading = applicationQueries.some((query) => query.isLoading) || positionQuery.isLoading;

  const applications = Object.fromEntries(
    applicationQueries.map((query, index) => [APPLICATION_CATEGORY[index], query.data || []]),
  ) as Record<ApplicationCategory, RecruitmentApplicationDto[]>;

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: RecruitmentApplicationStateDto }) =>
      updateRecruitmentApplicationStateForPosition(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries();

      const previousData: Partial<Record<ApplicationCategory, RecruitmentApplicationDto[]>> = {};

      for (const type of APPLICATION_CATEGORY) {
        const queryData = queryClient.getQueryData<RecruitmentApplicationDto[]>(
          queryKeys.applications(positionId, type),
        );
        if (queryData) {
          previousData[type] = queryData;
        }
      }

      for (const type of APPLICATION_CATEGORY) {
        queryClient.setQueryData<RecruitmentApplicationDto[]>(queryKeys.applications(positionId, type), (old) => {
          if (!old) return [];
          return old.map((app) => (app.id === id ? { ...app, ...data } : app));
        });
      }

      return { previousData };
    },
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
    onSuccess: () => {
      for (const type of APPLICATION_CATEGORY) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.applications(positionId, type),
        });
      }
    },
  });

  const updateApplicationState = (id: string, data: RecruitmentApplicationStateDto) => {
    updateMutation.mutate({ id, data });
  };

  const title = t(KEY.recruitment_administrate_applications);
  useTitle(title);
  const headerTitle = `${t(KEY.recruitment_administrate_applications)} for  ${positionQuery.data ? dbT(positionQuery.data?.data, 'name') : 'N/A'}`;
  const backendUrl = reverse({
    pattern: ROUTES.backend.admin__samfundet_recruitmentposition_change,
    urlParams: { objectId: positionId },
  });

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

  return (
    <AdminPageLayout title={headerTitle} backendUrl={backendUrl} header={header} loading={isLoading}>
      <Text size="l" as="strong" className={styles.subHeader}>
        {lowerCapitalize(t(KEY.recruitment_applications))} ({applications.unprocessed?.length || 0})
      </Text>

      <RecruitmentApplicantsStatus
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

      <div className={styles.container}>
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
      </div>
    </AdminPageLayout>
  );
}
