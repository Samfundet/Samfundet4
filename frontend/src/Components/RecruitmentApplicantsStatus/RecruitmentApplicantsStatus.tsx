import { useTranslation } from 'react-i18next';
import { TimeDisplay, ToolTip } from '~/Components';
import { Dropdown, type DropdownOption } from '~/Components/Dropdown/Dropdown';
import { Table } from '~/Components/Table';
import { Text } from '~/Components/Text/Text';
import type { RecruitmentApplicationDto, RecruitmentApplicationStateDto } from '~/dto';
import { useCustomNavigate } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { RecruitmentPriorityChoices, RecruitmentPriorityChoicesMapping } from '~/types';
import { Badge } from '../Badge/Badge';
import { Link } from '../Link';
import { SetInterviewManuallyModal } from '../SetInterviewManually';
import styles from './RecruitmentApplicantsStatus.module.scss';

type RecruitmentApplicantsStatusProps = {
  applicants: RecruitmentApplicationDto[];
  recruitmentId: number | string | undefined;
  gangId: number | string | undefined;
  positionId: number | string | undefined;
  updateStateFunction: (id: string, data: RecruitmentApplicationStateDto) => void;
  onInterviewChange: () => void;
};

// TODO add backend to fetch these
const priorityOptions: DropdownOption<number>[] = [
  { label: 'Not Set', value: 0 },
  { label: 'Reserve', value: 1 },
  { label: 'Wanted', value: 2 },
  { label: 'Not Wanted', value: 3 },
];

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
    { content: t(KEY.recruitment_recruiter_guide), sortable: true, hideSortButton: false },
    { content: t(KEY.recruitment_recruiter_status), sortable: false, hideSortButton: false },
    { content: 't(KEY.common_comment)', sortable: false, hideSortButton: true },
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

  function getStatusText(applicantstatus: number | undefined) {
    if (typeof applicantstatus !== 'undefined') {
      const priority = RecruitmentPriorityChoicesMapping[applicantstatus];
      if (priority === RecruitmentPriorityChoices.WANTED) {
        return t(KEY.recruitment_guide_offer);
      }
      return t(KEY.recruitment_guide_no_offer);
    }
  }

  const data = applicants.map((application) => {
    const applicationStatusStyle = getStatusStyle(application?.applicant_state);
    const guideText = getStatusText(application?.recruiter_priority);
    return {
      cells: [
        {
          value: application.user.first_name,
          style: styles.pending,
          content: (
            <div className={styles.wrapper}>
              <div className={styles.show_div}>{t(KEY.common_show)}</div>
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
            </div>
          ),
        },
        {
          value: application.applicant_priority,
          style: styles.pending,
          content: (
            <div className={styles.wrapper}>
              <div className={styles.show_div}>{t(KEY.common_show)}</div>
              <div className={styles.text}>
                {application.applicant_priority} / {application?.application_count}
              </div>
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
          style: styles.pending,
          content: application.interview?.interview_time ? (
            <TimeDisplay timestamp={application.interview.interview_time} displayType="nice-date-time" />
          ) : (
            <Text>{t(KEY.common_not_set)}</Text>
          ),
        },
        {
          value: application.interview?.interview_location,
          style: styles.pending,
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
          style: styles.pending,
          content: (
            <Dropdown
              value={application.recruiter_priority}
              disableIcon={true}
              classNameSelect={styles.dropdown}
              options={priorityOptions}
              onChange={(value) => updateApplications(application.id, editChoices.update_recruitment_priority, value)}
            />
          ),
        },
        {
          value: application.recruiter_status,
          style: styles.pending,
          content: (
            <ToolTip value="her skal det stå noe informativt">
              <Badge className={applicationStatusStyle} text={guideText} />
            </ToolTip>
          ),
        },
        {
          value: application.recruiter_status,
          style: styles.pending,
          content: (
            <Dropdown
              value={application.recruiter_status}
              disableIcon={true}
              classNameSelect={styles.dropdown}
              options={statusOptions}
              onChange={(value) => updateApplications(application.id, editChoices.update_recruitment_status, value)}
            />
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
