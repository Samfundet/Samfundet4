import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button, RecruitmentApplicantsStatus } from '~/Components';

import { getRecruitmentApplicationsForGang } from '~/api';
import { RecruitmentApplicationDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import { ProcessedApplicants } from './components';
import styles from './RecruitmentPositionOverviewPage.module.scss';
import { Text } from '~/Components/Text/Text';
import { useTitle } from '~/hooks';

export function RecruitmentPositionOverviewPage() {
  const { recruitmentId, gangId, positionId } = useParams();
  const [recruitmentApplicants, setRecruitmentApplicants] = useState<RecruitmentApplicationDto[]>([]);
  const [withdrawnApplicants, setWithdrawnApplicants] = useState<RecruitmentApplicationDto[]>([]);
  const [rejectedApplicants, setRejectedApplicants] = useState<RecruitmentApplicationDto[]>([]);
  const [acceptedApplicants, setAcceptedApplicants] = useState<RecruitmentApplicationDto[]>([]);

  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();
  useEffect(() => {
    recruitmentId &&
      gangId &&
      getRecruitmentApplicationsForGang(gangId, recruitmentId).then((data) => {
        setRecruitmentApplicants(
          data.data.filter(
            (recruitmentApplicant) =>
              !recruitmentApplicant.withdrawn &&
              recruitmentApplicant.recruiter_status == 0 &&
              recruitmentApplicant.recruitment_position?.toString() == positionId,
          ),
        );
        setWithdrawnApplicants(
          data.data.filter(
            (recruitmentApplicant) =>
              recruitmentApplicant.withdrawn && recruitmentApplicant.recruitment_position?.toString() == positionId,
          ),
        );
        setRejectedApplicants(
          data.data.filter(
            (recruitmentApplicant) =>
              !recruitmentApplicant.withdrawn &&
              (recruitmentApplicant.recruiter_status == 2 || recruitmentApplicant.recruiter_status == 3) &&
              recruitmentApplicant.recruitment_position?.toString() == positionId,
          ),
        );
        setAcceptedApplicants(
          data.data.filter(
            (recruitmentApplicant) =>
              !recruitmentApplicant.withdrawn &&
              recruitmentApplicant.recruiter_status == 1 &&
              recruitmentApplicant.recruitment_position?.toString() == positionId,
          ),
        );
        setShowSpinner(false);
      });
  }, [recruitmentId, gangId, positionId]);

  const title = t(KEY.recruitment_administrate_applications);
  useTitle(title);
  const backendUrl = reverse({
    pattern: ROUTES.backend.admin__samfundet_recruitmentposition_change,
    urlParams: {
      objectId: positionId,
    },
  });

  const header = (
    <Button
      theme="success"
      rounded={true}
      link={reverse({
        pattern: ROUTES.frontend.admin_recruitment_gang_position_overview,
        urlParams: {
          gangId: gangId,
          recruitmentId: recruitmentId,
        },
      })}
    >
      {t(KEY.common_go_back)}
    </Button>
  );

  return (
    <AdminPageLayout title={title} backendUrl={backendUrl} header={header} loading={showSpinner}>
      <RecruitmentApplicantsStatus
        applicants={recruitmentApplicants}
        recruitmentId={recruitmentId}
        gangId={gangId}
        positionId={positionId}
      />

      <div className={styles.sub_container}>
        <Text size="l" as="strong" className={styles.subHeader}>
          {t(KEY.recruitment_accepted_applications)}({acceptedApplicants.length})
        </Text>
        <Text className={styles.subText}>{t(KEY.recruitment_accepted_applications_help_text)}</Text>
        {acceptedApplicants.length > 0 ? (
          <ProcessedApplicants data={acceptedApplicants} type="accepted" />
        ) : (
          <Text as="i" className={styles.subText}>
            {t(KEY.recruitment_accepted_applications_empty_text)}
          </Text>
        )}
      </div>

      <div className={styles.sub_container}>
        <Text size="l" as="strong" className={styles.subHeader}>
          {t(KEY.recruitment_rejected_applications)}({rejectedApplicants.length})
        </Text>
        <Text className={styles.subText}>{t(KEY.recruitment_rejected_applications_help_text)}</Text>
        {rejectedApplicants.length > 0 ? (
          <ProcessedApplicants data={rejectedApplicants} type="rejected" />
        ) : (
          <Text as="i" className={styles.subText}>
            {t(KEY.recruitment_rejected_applications_empty_text)}
          </Text>
        )}
      </div>

      <div className={styles.sub_container}>
        <Text size="l" as="strong" className={styles.subHeader}>
          {t(KEY.recruitment_withdrawn_applications)}({withdrawnApplicants.length})
        </Text>
        {withdrawnApplicants.length > 0 ? (
          <ProcessedApplicants data={withdrawnApplicants} type="withdrawn" />
        ) : (
          <Text as="i" className={styles.subText}>
            {' '}
            {t(KEY.recruitment_withdrawn_applications_empty_text)}
          </Text>
        )}
      </div>
    </AdminPageLayout>
  );
}
