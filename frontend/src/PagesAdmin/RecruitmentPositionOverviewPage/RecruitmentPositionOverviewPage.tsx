import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, RecruitmentApplicantsStatus } from '~/Components';
import { Text } from '~/Components/Text/Text';
import { getRecruitmentApplicationsForRecruitmentPosition, updateRecruitmentApplicationStateForPosition } from '~/api';
import type { RecruitmentApplicationDto, RecruitmentApplicationStateDto } from '~/dto';
import { useTitle } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './RecruitmentPositionOverviewPage.module.scss';
import { ProcessedApplicants } from './components';

const withdrawnFilter = (data: RecruitmentApplicationDto[], positionId: string) => {
  return data.filter(
    (recruitmentApplicant) =>
      recruitmentApplicant.withdrawn && recruitmentApplicant.recruitment_position?.id === Number.parseInt(positionId),
  );
};

const applicantsFilter = (data: RecruitmentApplicationDto[], positionId: string) => {
  return data.filter(
    (recruitmentApplicant) =>
      !recruitmentApplicant.withdrawn &&
      recruitmentApplicant.recruiter_status === 0 &&
      recruitmentApplicant.recruitment_position?.id === Number.parseInt(positionId),
  );
};

const hardToGetFilter = (data: RecruitmentApplicationDto[], positionId: string) => {
  return data.filter(
    (recruitmentApplicant) =>
      !recruitmentApplicant.withdrawn &&
      recruitmentApplicant.recruiter_status === 2 &&
      recruitmentApplicant.recruitment_position?.id === Number.parseInt(positionId),
  );
};

const acceptedApplicantsFilter = (data: RecruitmentApplicationDto[], positionId: string) => {
  return data.filter(
    (recruitmentApplicant) =>
      !recruitmentApplicant.withdrawn &&
      recruitmentApplicant.recruiter_status === 3 &&
      recruitmentApplicant.recruitment_position?.id === Number.parseInt(positionId),
  );
};

const rejectedApplicantsFilter = (data: RecruitmentApplicationDto[], positionId: string) => {
  return data.filter(
    (recruitmentApplicant) =>
      !recruitmentApplicant.withdrawn &&
      recruitmentApplicant.recruiter_status === 3 &&
      recruitmentApplicant.recruitment_position?.id === Number.parseInt(positionId),
  );
};

export function RecruitmentPositionOverviewPage() {
  const navigate = useNavigate();
  const { recruitmentId, gangId, positionId } = useParams();
  const [recruitmentApplicants, setRecruitmentApplicants] = useState<RecruitmentApplicationDto[]>([]);
  const [withdrawnApplicants, setWithdrawnApplicants] = useState<RecruitmentApplicationDto[]>([]);
  const [rejectedApplicants, setRejectedApplicants] = useState<RecruitmentApplicationDto[]>([]);
  const [acceptedApplicants, setAcceptedApplicants] = useState<RecruitmentApplicationDto[]>([]);
  const [hardtogetApplicants, setHardtogetApplicants] = useState<RecruitmentApplicationDto[]>([]); //Applicants that have been offered a position, but did not accept it

  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();
  const load = useCallback(() => {
    if (!positionId) {
      return;
    }
    getRecruitmentApplicationsForRecruitmentPosition(positionId)
      .then((response) => {
        setRecruitmentApplicants(applicantsFilter(response.data, positionId));
        setWithdrawnApplicants(withdrawnFilter(response.data, positionId));
        setHardtogetApplicants(hardToGetFilter(response.data, positionId));
        setRejectedApplicants(rejectedApplicantsFilter(response.data, positionId));
        setAcceptedApplicants(acceptedApplicantsFilter(response.data, positionId));
        setShowSpinner(false);
      })
      .catch((data) => {
        if (data.status === STATUS.HTTP_404_NOT_FOUND) {
          navigate(ROUTES.frontend.not_found, { replace: true });
        }
        toast.error(t(KEY.common_something_went_wrong));
      });
  }, [positionId, navigate]);

  useEffect(() => {
    load();
  }, [load]);

  const updateApplicationState = (id: string, data: RecruitmentApplicationStateDto) => {
    positionId &&
      updateRecruitmentApplicationStateForPosition(id, data)
        .then((response) => {
          setRecruitmentApplicants(applicantsFilter(response.data, positionId));
          setWithdrawnApplicants(withdrawnFilter(response.data, positionId));
          setHardtogetApplicants(hardToGetFilter(response.data, positionId));
          setRejectedApplicants(rejectedApplicantsFilter(response.data, positionId));
          setAcceptedApplicants(acceptedApplicantsFilter(response.data, positionId));
          setShowSpinner(false);
        })
        .catch((data) => {
          toast.error(t(KEY.common_something_went_wrong));
          console.error(data);
        });
  };

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
      <Text size="l" as="strong" className={styles.subHeader}>
        {lowerCapitalize(t(KEY.recruitment_applications))} ({recruitmentApplicants.length})
      </Text>
      <RecruitmentApplicantsStatus
        applicants={recruitmentApplicants}
        recruitmentId={recruitmentId}
        gangId={gangId}
        positionId={positionId}
        updateStateFunction={updateApplicationState}
        onInterviewChange={load}
      />

      <div className={styles.sub_container}>
        <Text size="l" as="strong" className={styles.subHeader}>
          {t(KEY.recruitment_accepted_applications)} ({acceptedApplicants.length})
        </Text>
        <Text className={styles.subText}>{t(KEY.recruitment_accepted_applications_help_text)}</Text>
        {acceptedApplicants.length > 0 ? (
          <ProcessedApplicants data={acceptedApplicants} type="accepted" revertStateFunction={updateApplicationState} />
        ) : (
          <Text as="i" className={styles.subText}>
            {t(KEY.recruitment_accepted_applications_empty_text)}
          </Text>
        )}
      </div>

      <div className={styles.sub_container}>
        <Text size="l" as="strong" className={styles.subHeader}>
          {t(KEY.recruitment_rejected_applications)} ({rejectedApplicants.length})
        </Text>
        <Text className={styles.subText}>{t(KEY.recruitment_rejected_applications_help_text)}</Text>
        {rejectedApplicants.length > 0 ? (
          <ProcessedApplicants data={rejectedApplicants} type="rejected" revertStateFunction={updateApplicationState} />
        ) : (
          <Text as="i" className={styles.subText}>
            {t(KEY.recruitment_rejected_applications_empty_text)}
          </Text>
        )}
      </div>
      <div className={styles.sub_container}>
        <Text size="l" as="strong" className={styles.subHeader}>
          {t(KEY.recruitment_hardtoget_applications)} ({hardtogetApplicants.length})
        </Text>
        <Text className={styles.subText}>{t(KEY.recruitment_hardtoget_applications_help_text)}</Text>
        {hardtogetApplicants.length > 0 ? (
          <ProcessedApplicants
            data={hardtogetApplicants}
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
          {t(KEY.recruitment_withdrawn_applications)} ({withdrawnApplicants.length})
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
