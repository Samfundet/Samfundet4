import styles from './RecruitmentApplicantsStatus.module.scss';
import { RecruitmentApplicationDto, RecruitmentAdmissionStateDto } from '~/dto';
import { useCustomNavigate } from '~/hooks';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { Link } from '../Link';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { InputField } from '~/Components';
import { putRecruitmentApplicationForGang } from '~/api';
import { CrudButtons } from '~/Components/CrudButtons/CrudButtons';
import { utcTimestampToLocal } from '~/utils';
import { DropDownOption, Dropdown } from '~/Components/Dropdown/Dropdown';
import { Table } from '~/Components/Table';

type RecruitmentApplicantsStatusProps = {
  applicants: RecruitmentApplicationDto[];
  recruitmentId: number | string | undefined;
  gangId: number | string | undefined;
  positionId: number | string | undefined;
  updateStateFunction: (id: string, data: RecruitmentAdmissionStateDto) => void;
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
  updateStateFunction,
}: RecruitmentApplicantsStatusProps) {
  const { t } = useTranslation();
  const navigate = useCustomNavigate();

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
    if (value) {
      switch (field) {
        case editChoices.update_recruitment_priority:
          updateStateFunction(id, { recruiter_priority: value as number });
          break;
        case editChoices.update_recruitment_status:
          updateStateFunction(id, { recruiter_status: value as number });
          break;
      }
    }
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

    const data = applicants.map(function (admission) {
    const applicationStatusStyle = getStatusStyle(application?.applicant_state);
    return [
      {
        value: application.user.first_name,
        style: applicationStatusStyle,
        content: (
          <Link
            url={reverse({
              pattern: ROUTES.frontend.admin_recruitment_applicant,
              urlParams: {
                applicationID: application.id,
              },
            })}
            className={styles.text}
          >
            {`${application.user.first_name} ${application.user.last_name}`}
          </Link>
        ),
      },
      {
        value: application.applicant_priority,
        style: applicationStatusStyle,
        content: (
          <div className={styles.text}>
            {application.applicant_priority} / {application?.application_count}
          </div>
        ),
      },
      {
        value: application.interview?.interview_time,
        style: applicationStatusStyle,
        content: (
          <InputField
            inputClassName={styles.input}
            value={
              application.interview?.interview_time ? utcTimestampToLocal(application.interview.interview_time) : ''
            }
            onBlur={() => putRecruitmentApplicationForGang(application.id.toString(), application)}
            onChange={(value: string) => updateApplications(application.id, editChoices.update_time, value)}
            type="datetime-local"
          />
        ),
      },
      {
        value: application.interview?.interview_location,
        style: applicationStatusStyle,
        content: (
          <InputField
            inputClassName={styles.input}
            value={application.interview?.interview_location ?? ''}
            onBlur={() => putRecruitmentApplicationForGang(application.id.toString(), application)}
            onChange={(value: string) => updateApplications(application.id, editChoices.update_location, value)}
          />
        ),
      },
      {
        value: application.recruiter_priority,
        style: applicationStatusStyle,
        content: (
          <Dropdown
            initialValue={application.recruiter_priority}
            disableIcon={true}
            classNameSelect={styles.dropdown}
            options={priorityOptions}
            onChange={(value) => updateApplications(application.id, editChoices.update_recruitment_priority, value)}
          />
        ),
      },
      {
        value: application.recruiter_status,
        style: applicationStatusStyle,
        content: (
          <Dropdown
            initialValue={application.recruiter_status}
            disableIcon={true}
            classNameSelect={styles.dropdown}
            options={statusOptions}
            onChange={(value) => updateApplications(application.id, editChoices.update_recruitment_status, value)}
          />
        ),
      },
      {
        style: applicationStatusStyle,
        content: (
          <CrudButtons
            onView={
              application.interview?.interview_time != null
                ? () => {
                    navigate({
                      url: reverse({
                        pattern: ROUTES.frontend.admin_recruitment_gang_position_applicants_interview_notes,
                        urlParams: {
                          recruitmentId: recruitmentId,
                          gangId: gangId,
                          positionId: positionId,
                          interviewId: application.interview?.id,
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
