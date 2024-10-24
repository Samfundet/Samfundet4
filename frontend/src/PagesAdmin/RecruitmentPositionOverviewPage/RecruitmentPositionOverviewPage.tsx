import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, RecruitmentApplicantsStatus } from '~/Components';
import { Text } from '~/Components/Text/Text';
import { getRecruitmentApplicationsForRecruitmentPosition, updateRecruitmentApplicationStateForPosition } from '~/api';
import type { RecruitmentApplicationStateDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './RecruitmentPositionOverviewPage.module.scss';
import { ProcessedApplicants } from './components';

const queryKeys = {
  applications: (positionId: string, filterType: string) => ['applications', positionId, filterType] as const,
};

export function RecruitmentPositionOverviewPage() {
  const navigate = useNavigate();
  const { recruitmentId, gangId, positionId } = useParams();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  // Store the query keys separately so we can use them for invalidation
  const filterTypes = ['unprocessed', 'withdrawn', 'hardtoget', 'rejected', 'accepted'] as const;
  const allQueryKeys = filterTypes.map((filterType) => queryKeys.applications(positionId!, filterType));

  const results = useQueries({
    queries: filterTypes.map((filterType) => ({
      queryKey: queryKeys.applications(positionId!, filterType),
      queryFn: () => getRecruitmentApplicationsForRecruitmentPosition(positionId!, filterType),
      enabled: !!positionId,
    })),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: RecruitmentApplicationStateDto }) =>
      updateRecruitmentApplicationStateForPosition(id, data),
    onSuccess: async () => {
      // Use the stored query keys for invalidation
      for (const queryKey of allQueryKeys) {
        await queryClient.invalidateQueries({ queryKey });
      }
    },
    onError: () => {
      toast.error(t(KEY.common_something_went_wrong));
    },
  });

  const onInterviewChange = async () => {
    for (const queryKey of allQueryKeys) {
      await queryClient.invalidateQueries({ queryKey });
    }
  };

  const title = t(KEY.recruitment_administrate_applications);
  useTitle(title);

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

  return (
    <AdminPageLayout title={title} backendUrl={backendUrl} header={header} loading={isLoading}>
      <Text size="l" as="strong" className={styles.subHeader}>
        {lowerCapitalize(t(KEY.recruitment_applications))} ({unprocessed.data?.data.length ?? 0})
      </Text>
      <RecruitmentApplicantsStatus
        applicants={results[0].data ?? []}
        recruitmentId={recruitmentId}
        gangId={gangId}
        positionId={positionId}
        updateStateFunction={updateApplicationState}
        onInterviewChange={onInterviewChange}
      />

      <div className={styles.sub_container}>
        <Text size="l" as="strong" className={styles.subHeader}>
          {t(KEY.recruitment_accepted_applications)} ({accepted.data?.data.length ?? 0})
        </Text>
        <Text className={styles.subText}>{t(KEY.recruitment_accepted_applications_help_text)}</Text>
        {(accepted.data?.data.length ?? 0) > 0 ? (
          <ProcessedApplicants
            data={accepted.data?.data ?? []}
            type="accepted"
            revertStateFunction={updateApplicationState}
          />
        ) : (
          <Text as="i" className={styles.subText}>
            {t(KEY.recruitment_accepted_applications_empty_text)}
          </Text>
        )}
      </div>

      {/* Similar pattern for rejected, hardtoget, and withdrawn sections */}
      {/* ... other sections follow the same pattern ... */}
    </AdminPageLayout>
  );
}
