import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { SamfundetLogoSpinner, TimeDisplay } from '~/Components';
import { CrudButtons } from '~/Components/CrudButtons/CrudButtons';
import { Dropdown, type DropdownOption } from '~/Components/Dropdown/Dropdown';
import { Table } from '~/Components/Table';
import { Text } from '~/Components/Text/Text';
import type { RecruitmentApplicationDto, RecruitmentApplicationStateDto } from '~/dto';
import { useCustomNavigate } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { Link } from '../../../../Components/Link';
import { SetInterviewManuallyModal } from '../../../../Components/SetInterviewManually';
import styles from './RecruitmentApplicantsStatus.module.scss';

type RecruitmentApplicantsStatusProps = {
  applicants: RecruitmentApplicationDto[];
  recruitmentId: number | string | undefined;
  gangId: number | string | undefined;
  positionId: number | string | undefined;
  updateStateFunction: (id: string, data: RecruitmentApplicationStateDto) => void;
  onInterviewChange: () => void;
  updatingId: string | null;
};

// TODO add backend to fetch these ISSUE #1575
const priorityOptions: DropdownOption<number>[] = [
  { label: 'Not Set', value: 0 },
  { label: 'Reserve', value: 1 },
  { label: 'Wanted', value: 2 },
  { label: 'Not Wanted', value: 3 },
];

// TODO add backend to fetch these ISSUE #1575
const statusOptions: DropdownOption<number>[] = [
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
  updatingId,
  applicants,
  recruitmentId,
  gangId,
  positionId,
  updateStateFunction,
  onInterviewChange,
}: RecruitmentApplicantsStatusProps) {
  const { t } = useTranslation();
  const navigate = useCustomNavigate();

  const tableColumns = [
    { content: t(KEY.recruitment_applicant), sortable: true, hideSortButton: false },
    { content: t(KEY.recruitment_priority), sortable: true, hideSortButton: false },
    { content: t(KEY.recruitment_interview_set), sortable: false, hideSortButton: true },
    { content: t(KEY.recruitment_interview_time), sortable: true, hideSortButton: false },
    { content: t(KEY.recruitment_interview_location), sortable: true, hideSortButton: false },
    { content: t(KEY.recruitment_recruiter_priority), sortable: true, hideSortButton: false },
    { content: t(KEY.recruitment_recruiter_status), sortable: true, hideSortButton: false },
    { content: t(KEY.recruitment_interview_notes), sortable: false, hideSortButton: true },
  ];

  function updateApplications(id: string, field: string, value: string | number | undefined) {
    switch (field) {
      case editChoices.update_recruitment_priority:
        updateStateFunction(id, { recruiter_priority: value as number });
        break;
      case editChoices.update_recruitment_status:
        updateStateFunction(id, { recruiter_status: value as number });
        break;
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
        styles.pending,
        styles.pending,
      ][status];
    }
  }

  const data = applicants.map((application) => {
    const applicationStatusStyle = getStatusStyle(application?.applicant_state);
    const isUpdating = updatingId === application.id;
    return {
      cells: [
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
          style: styles.interviewField,
          content: (
            <SetInterviewManuallyModal
              recruitmentId={Number(recruitmentId) || 0}
              isButtonRounded={false}
              application={application}
              onSetInterview={onInterviewChange}
            />
          ),
        },
        {
          value: application.interview?.interview_time,
          style: applicationStatusStyle,
          content: application.interview?.interview_time ? (
            <TimeDisplay timestamp={application.interview.interview_time} displayType="nice-date-time" />
          ) : (
            <Text>{t(KEY.common_not_set)}</Text>
          ),
        },
        {
          value: application.interview?.interview_location,
          style: applicationStatusStyle,
          content: (
            <Text>
              {application.interview?.interview_location
                ? application.interview?.interview_location
                : t(KEY.common_not_set)}
            </Text>
          ),
        },
        {
          value: application.recruiter_priority,
          style: applicationStatusStyle,
          content: (
            <Fragment>
              {isUpdating && <SamfundetLogoSpinner className={styles.loadingApplState} />}
              <Dropdown
                disabled={isUpdating}
                value={application.recruiter_priority}
                disableIcon={true}
                classNameSelect={styles.dropdown}
                options={priorityOptions}
                onChange={(value) => updateApplications(application.id, editChoices.update_recruitment_priority, value)}
              />
            </Fragment>
          ),
        },
        {
          value: application.recruiter_status,
          style: applicationStatusStyle,
          content: (
            <Fragment>
              {isUpdating && <SamfundetLogoSpinner className={styles.loadingApplState} />}
              <Dropdown
                disabled={isUpdating}
                value={application.recruiter_status}
                disableIcon={true}
                classNameSelect={styles.dropdown}
                options={statusOptions}
                onChange={(value) => updateApplications(application.id, editChoices.update_recruitment_status, value)}
              />
            </Fragment>
          ),
        },
        {
          style: applicationStatusStyle,
          content: (
            <div className={styles.crud}>
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
            </div>
          ),
        },
      ],
    };
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
