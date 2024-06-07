import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Dropdown, InputField, Link } from '~/Components';
import { DropDownOption } from '~/Components/Dropdown/Dropdown';
import { Table } from '~/Components/Table';
import { getRecruitmentAdmissionsForGang, putRecruitmentAdmissionForGang } from '~/api';
import { RecruitmentAdmissionDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { utcTimestampToLocal } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import { CrudButtons } from '~/Components/CrudButtons/CrudButtons';
import { ProcessedApplicants } from './components';
import styles from './RecruitmentPositionOverviewPage.module.scss';
import { Text } from '~/Components/Text/Text';
// TODO: Fetch from backend
const priorityOptions: DropDownOption<number>[] = [
  { label: 'Not Set', value: 0 },
  { label: 'Not Wanted', value: 1 },
  { label: 'Wanted', value: 2 },
  { label: 'Reserve', value: 3 },
];

const statusOptions: DropDownOption<number>[] = [
  { label: 'Nothing', value: 0 },
  { label: 'Called and accepted', value: 1 },
  { label: 'Called and rejected', value: 2 },
  { label: 'Automatic rejection', value: 3 },
];

function immutableSet(
  list: RecruitmentAdmissionDto[],
  oldValue: RecruitmentAdmissionDto,
  newValue: RecruitmentAdmissionDto,
) {
  return list.map((element: RecruitmentAdmissionDto) => {
    if (element.id === oldValue.id) {
      return newValue;
    } else {
      return element;
    }
  });
}

export function RecruitmentPositionOverviewPage() {
  const recruitmentId = useParams().recruitmentId;
  const gangId = useParams().gangId;
  const positionId = useParams().positionId;
  const [recruitmentApplicants, setRecruitmentApplicants] = useState<RecruitmentAdmissionDto[]>([]);
  const [withdrawnApplicants, setWithdrawnApplicants] = useState<RecruitmentAdmissionDto[]>([]);
  const [rejectedApplicants, setRejectedApplicants] = useState<RecruitmentAdmissionDto[]>([]);
  const [acceptedApplicants, setAcceptedApplicants] = useState<RecruitmentAdmissionDto[]>([]);

  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();
  const navigate = useNavigate();
  useEffect(() => {
    recruitmentId &&
      gangId &&
      getRecruitmentAdmissionsForGang(gangId, recruitmentId).then((data) => {
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

  const tableColumns = [
    { content: t(KEY.recruitment_applicant), sortable: true },
    { content: t(KEY.recruitment_priority), sortable: true },
    { content: t(KEY.recruitment_interview_time), sortable: true },
    { content: t(KEY.recruitment_interview_location), sortable: true },
    { content: t(KEY.recruitment_recruiter_priority), sortable: true },
    { content: t(KEY.recruitment_recruiter_status), sortable: true },
    { content: t(KEY.recruitment_interview_notes), sortable: false },
  ];
  const data = recruitmentApplicants.map(function (admission) {
    return [
      {
        content: (
          <Link
            key={admission.user.id}
            target={'backend'}
            url={reverse({
              pattern: ROUTES.backend.admin__samfundet_recruitmentadmission_change,
              urlParams: {
                objectId: admission.id,
              },
            })}
          >
            {`${admission.user.first_name} ${admission.user.last_name}`}
          </Link>
        ),
      },
      { content: admission.applicant_priority },
      {
        content: (
          <InputField
            value={admission.interview.interview_time ? utcTimestampToLocal(admission.interview.interview_time) : ''}
            onBlur={() => putRecruitmentAdmissionForGang(admission.id.toString(), admission)}
            onChange={(value: string) => {
              const updatedInterview = { ...admission.interview, interview_time: value.toString() };
              const newAdmission = { ...admission, interview: updatedInterview };
              setRecruitmentApplicants(immutableSet(recruitmentApplicants, admission, newAdmission));
            }}
            type="datetime-local"
          />
        ),
      },
      {
        content: (
          <InputField
            value={admission.interview.interview_location ?? ''}
            onBlur={() => putRecruitmentAdmissionForGang(admission.id.toString(), admission)}
            onChange={(value: string) => {
              const updatedInterview = { ...admission.interview, interview_location: value.toString() };
              const newAdmission = { ...admission, interview: updatedInterview };
              setRecruitmentApplicants(immutableSet(recruitmentApplicants, admission, newAdmission));
            }}
          />
        ),
      },
      {
        content: (
          <Dropdown
            initialValue={admission.recruiter_priority}
            options={priorityOptions}
            onChange={(value) => {
              const newAdmission = { ...admission, recruiter_priority: value };
              setRecruitmentApplicants(immutableSet(recruitmentApplicants, admission, newAdmission));
              putRecruitmentAdmissionForGang(admission.id.toString(), newAdmission);
            }}
          />
        ),
      },
      {
        content: (
          <Dropdown
            initialValue={admission.recruiter_status}
            options={statusOptions}
            onChange={(value) => {
              const newAdmission = { ...admission, recruiter_status: value };
              setRecruitmentApplicants(immutableSet(recruitmentApplicants, admission, newAdmission));
              putRecruitmentAdmissionForGang(admission.id.toString(), newAdmission);
            }}
          />
        ),
      },
      {
        content: (
          <CrudButtons
            onView={
              admission.interview.interview_time != null
                ? () => {
                    navigate(
                      reverse({
                        pattern: ROUTES.frontend.admin_recruitment_gang_position_applicants_interview_notes,
                        urlParams: {
                          recruitmentId: recruitmentId,
                          gangId: gangId,
                          positionId: positionId,
                          interviewId: admission.interview.id,
                        },
                      }),
                    );
                  }
                : undefined
            }
          />
        ),
      },
    ];
  });
  const title = t(KEY.admin_information_manage_title);
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
      <Table columns={tableColumns} data={data} />

      <div className={styles.sub_container}>
        <Text size="l" as="strong" className={styles.subHeader}>
          {t(KEY.recruitment_accepted_admissions)}({acceptedApplicants.length})
        </Text>
        <Text className={styles.subText}>{t(KEY.recruitment_accepted_admissions_help_text)}</Text>
        {acceptedApplicants.length > 0 ? (
          <ProcessedApplicants data={acceptedApplicants} type="accepted" />
        ) : (
          <Text as="i" className={styles.subText}>
            {t(KEY.recruitment_accepted_admissions_empty_text)}
          </Text>
        )}
      </div>

      <div className={styles.sub_container}>
        <Text size="l" as="strong" className={styles.subHeader}>
          {t(KEY.recruitment_rejected_admissions)}({rejectedApplicants.length})
        </Text>
        <Text className={styles.subText}>{t(KEY.recruitment_rejected_admissions_help_text)}</Text>
        {rejectedApplicants.length > 0 ? (
          <ProcessedApplicants data={rejectedApplicants} type="rejected" />
        ) : (
          <Text as="i" className={styles.subText}>
            {t(KEY.recruitment_rejected_admissions_empty_text)}
          </Text>
        )}
      </div>

      <div className={styles.sub_container}>
        <Text size="l" as="strong" className={styles.subHeader}>
          {t(KEY.recruitment_withdrawn_admissions)}({withdrawnApplicants.length})
        </Text>
        {withdrawnApplicants.length > 0 ? (
          <ProcessedApplicants data={withdrawnApplicants} type="withdrawn" />
        ) : (
          <Text as="i" className={styles.subText}>
            {' '}
            {t(KEY.recruitment_withdrawn_admissions_empty_text)}
          </Text>
        )}
      </div>
    </AdminPageLayout>
  );
}
