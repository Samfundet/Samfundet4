import styles from './RecruitmentApplicantsStatus.module.scss';
import { RecruitmentAdmissionDto } from '~/dto';
import { useEffect, useState } from 'react';
import { useCustomNavigate } from '~/hooks';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { Link } from '../Link';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { InputField } from '../InputField';
import { putRecruitmentAdmissionForGang } from '~/api';
import { CrudButtons } from '~/Components/CrudButtons/CrudButtons';
import { utcTimestampToLocal } from '~/utils';
import { DropDownOption, Dropdown } from '~/Components/Dropdown/Dropdown';
import { Table } from '~/Components/Table';

type RecruitmentApplicantsStatusProps = {
  applicants: RecruitmentAdmissionDto[];
  recruitmentId: number | string | undefined;
  gangId: number | string | undefined;
  positionId: number | string | undefined;
};

// TODO add backend to fetch these
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

const editChoices = {
  update_time: 'update_time',
  update_location: 'update_location',
  update_recruitment_priority: 'update_recruitment_priority',
  update_recruitment_status: 'update_recruitment_status',
};

export function RecruitmentApplicantsStatus({
  applicants,
  recruitmentId,
  gangId,
  positionId,
}: RecruitmentApplicantsStatusProps) {
  const [recruitmentApplicants, setRecruitmentApplicants] = useState<RecruitmentAdmissionDto[]>([]);
  const { t } = useTranslation();
  const navigate = useCustomNavigate();

  useEffect(() => {
    setRecruitmentApplicants(applicants);
  }, [applicants]);

  const tableColumns = [
    { content: t(KEY.recruitment_applicant), sortable: true, hideSortButton: true },
    { content: t(KEY.recruitment_priority), sortable: true, hideSortButton: true },
    { content: t(KEY.recruitment_interview_time), sortable: true, hideSortButton: true },
    { content: t(KEY.recruitment_interview_location), sortable: true, hideSortButton: true },
    { content: t(KEY.recruitment_recruiter_priority), sortable: true, hideSortButton: true },
    { content: t(KEY.recruitment_recruiter_status), sortable: true, hideSortButton: true },
    { content: t(KEY.recruitment_interview_notes), sortable: false, hideSortButton: true },
  ];

  function updateAdmissions(id: string, field: string, value: string | number | undefined) {
    setRecruitmentApplicants(
      recruitmentApplicants.map((element: RecruitmentAdmissionDto) => {
        if (element.id === id) {
          switch (field) {
            case editChoices.update_recruitment_priority:
              element = { ...element, recruiter_priority: value as number };
              break;
            case editChoices.update_recruitment_status:
              element = { ...element, recruiter_status: value as number };
              break;
          }
        }
        return element;
      }),
    );
    return value;
  }

  function getStatusStyle(status: number | undefined) {
    if (typeof status !== 'undefined') {
      return [
        styles.pending,
        styles.top_reserve,
        styles.top_wanted,
        styles.less_reserve,
        styles.less_reserve_wanted,
        styles.less_reserve_reserve,
        styles.less_wanted,
        styles.less_wanted_wanted,
        styles.less_wanted_reserve,
      ][status];
    }
  }

  const data = recruitmentApplicants.map(function (admission) {
    const admissionStatusStyle = getStatusStyle(admission?.applicant_state);
    return [
      {
        value: admission.user.first_name,
        style: admissionStatusStyle,
        content: (
          <Link
            url={reverse({
              pattern: ROUTES.frontend.admin_recruitment_applicant,
              urlParams: {
                admissionID: admission.id,
              },
            })}
            className={styles.text}
          >
            {`${admission.user.first_name} ${admission.user.last_name}`}
          </Link>
        ),
      },
      {
        value: admission.applicant_priority,
        style: admissionStatusStyle,
        content: (
          <div className={styles.text}>
            {admission.applicant_priority} / {admission?.admission_count}
          </div>
        ),
      },
      {
        value: admission.interview?.interview_time,
        style: admissionStatusStyle,
        content: (
          <InputField
            inputClassName={styles.input}
            value={admission.interview?.interview_time ? utcTimestampToLocal(admission.interview.interview_time) : ''}
            onBlur={() => putRecruitmentAdmissionForGang(admission.id.toString(), admission)}
            onChange={(value: string) => updateAdmissions(admission.id, editChoices.update_time, value)}
            type="datetime-local"
          />
        ),
      },
      {
        value: admission.interview?.interview_location,
        style: admissionStatusStyle,
        content: (
          <InputField
            inputClassName={styles.input}
            value={admission.interview?.interview_location ?? ''}
            onBlur={() => putRecruitmentAdmissionForGang(admission.id.toString(), admission)}
            onChange={(value: string) => updateAdmissions(admission.id, editChoices.update_location, value)}
          />
        ),
      },
      {
        value: admission.recruiter_priority,
        style: admissionStatusStyle,
        content: (
          <Dropdown
            initialValue={admission.recruiter_priority}
            disableIcon={true}
            classNameSelect={styles.dropdown}
            options={priorityOptions}
            onChange={(value) => updateAdmissions(admission.id, editChoices.update_recruitment_priority, value)}
          />
        ),
      },
      {
        value: admission.recruiter_status,
        style: admissionStatusStyle,
        content: (
          <Dropdown
            initialValue={admission.recruiter_status}
            disableIcon={true}
            classNameSelect={styles.dropdown}
            options={statusOptions}
            onChange={(value) => updateAdmissions(admission.id, editChoices.update_recruitment_status, value)}
          />
        ),
      },
      {
        style: admissionStatusStyle,
        content: (
          <CrudButtons
            onView={
              admission.interview?.interview_time != null
                ? () => {
                    navigate({
                      url: reverse({
                        pattern: ROUTES.frontend.admin_recruitment_gang_position_applicants_interview_notes,
                        urlParams: {
                          recruitmentId: recruitmentId,
                          gangId: gangId,
                          positionId: positionId,
                          interviewId: admission.interview?.id,
                        },
                      }),
                    });
                  }
                : undefined
            }
          />
        ),
      },
    ];
  });

  return (
    <Table
      className={styles.table}
      bodyRowClassName={styles.tableRow}
      cellClassName={styles.rows}
      headerColumnClassName={styles.header}
      columns={tableColumns}
      data={data}
    />
  );
}
