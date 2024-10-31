import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, RecruitmentApplicantsStatus, Text } from '~/Components';
import { getRecruitmentApplicationsForRecruitmentPosition, updateRecruitmentApplicationStateForPosition } from '~/api';
import type { RecruitmentApplicationDto, RecruitmentApplicationStateDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './RecruitmentPositionOverviewPage.module.scss';
import { ProcessedApplicants } from './components';

export function RecruitmentPositionOverviewPage() {
  const navigate = useNavigate();
  const { recruitmentId, gangId, positionId } = useParams();
  const { t } = useTranslation();

  const [applications, setApplications] = useState<{
    unprocessed: RecruitmentApplicationDto[];
    withdrawn: RecruitmentApplicationDto[];
    hardtoget: RecruitmentApplicationDto[];
    rejected: RecruitmentApplicationDto[];
    accepted: RecruitmentApplicationDto[];
  }>({
    unprocessed: [],
    withdrawn: [],
    hardtoget: [],
    rejected: [],
    accepted: [],
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadApplications = async () => {
    if (!positionId) return;

    try {
      const [unprocessed, accepted, withdrawn, hardtoget, rejected] = await Promise.all([
        getRecruitmentApplicationsForRecruitmentPosition(positionId, 'unprocessed'),
        getRecruitmentApplicationsForRecruitmentPosition(positionId, 'accepted'),
        getRecruitmentApplicationsForRecruitmentPosition(positionId, 'withdrawn'),
        getRecruitmentApplicationsForRecruitmentPosition(positionId, 'hardtoget'),
        getRecruitmentApplicationsForRecruitmentPosition(positionId, 'rejected'),
      ]);

      setApplications({
        unprocessed: unprocessed || [],
        accepted: accepted || [],
        withdrawn: withdrawn || [],
        hardtoget: hardtoget || [],
        rejected: rejected || [],
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading applications:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [positionId]);

  const updateApplicationState = (id: string, data: RecruitmentApplicationStateDto) => {
    if (!recruitmentId) return;
    updateRecruitmentApplicationStateForPosition(id, data).then((response) => {
      //setApplications(response.data);
      console.log('UPDATED RECRUITMENT APPLICATION STATE', response);
      loadApplications();
    });
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
        {lowerCapitalize(t(KEY.recruitment_applications))} ({applications.unprocessed.length})
      </Text>

      <RecruitmentApplicantsStatus
        applicants={applications.unprocessed}
        recruitmentId={recruitmentId}
        gangId={gangId}
        positionId={positionId}
        updateStateFunction={updateApplicationState}
        onInterviewChange={loadApplications}
      />
      <div className={styles.container}>
        <div className={styles.sub_container}>
          <Text size="l" as="strong" className={styles.subHeader}>
            {t(KEY.recruitment_accepted_applications)} ({applications.accepted.length})
          </Text>
          <Text className={styles.subText}>{t(KEY.recruitment_accepted_applications_help_text)}</Text>
          {applications.accepted.length > 0 ? (
            <ProcessedApplicants
              data={applications.accepted}
              type="accepted"
              revertStateFunction={updateApplicationState}
            />
          ) : (
            <Text as="i" className={styles.subText}>
              {t(KEY.recruitment_accepted_applications_empty_text)}
            </Text>
          )}
        </div>

        <div className={styles.sub_container}>
          <Text size="l" as="strong" className={styles.subHeader}>
            {t(KEY.recruitment_rejected_applications)} ({applications.rejected.length})
          </Text>
          <Text className={styles.subText}>{t(KEY.recruitment_rejected_applications_help_text)}</Text>
          {applications.rejected.length > 0 ? (
            <ProcessedApplicants
              data={applications.rejected}
              type="rejected"
              revertStateFunction={updateApplicationState}
            />
          ) : (
            <Text as="i" className={styles.subText}>
              {t(KEY.recruitment_rejected_applications_empty_text)}
            </Text>
          )}
        </div>

        <div className={styles.sub_container}>
          <Text size="l" as="strong" className={styles.subHeader}>
            {t(KEY.recruitment_hardtoget_applications)} ({applications.hardtoget.length})
          </Text>
          <Text className={styles.subText}>{t(KEY.recruitment_hardtoget_applications_help_text)}</Text>
          {applications.hardtoget.length > 0 ? (
            <ProcessedApplicants
              data={applications.hardtoget}
              type="hardtoget"
              revertStateFunction={updateApplicationState}
            />
          ) : (
            <Text as="i" className={styles.subText}>
              {t(KEY.recruitment_hardtoget_applications_empty_text)}
            </Text>
          )}
        </div>

        <div className={styles.sub_container}>
          <Text size="l" as="strong" className={styles.subHeader}>
            {t(KEY.recruitment_withdrawn_applications)} ({applications.withdrawn.length})
          </Text>
          {applications.withdrawn.length > 0 ? (
            <ProcessedApplicants data={applications.withdrawn} type="withdrawn" />
          ) : (
            <Text as="i" className={styles.subText}>
              {t(KEY.recruitment_withdrawn_applications_empty_text)}
            </Text>
          )}
        </div>
      </div>
    </AdminPageLayout>
  );
}
