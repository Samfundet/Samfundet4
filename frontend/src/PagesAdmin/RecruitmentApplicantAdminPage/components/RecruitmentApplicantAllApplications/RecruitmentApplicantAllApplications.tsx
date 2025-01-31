import { useTranslation } from 'react-i18next';
import { Link, Table } from '~/Components';
import type { RecruitmentApplicationDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';

type Props = {
  applications: RecruitmentApplicationDto[] | undefined;
};

export function RecruitmentApplicantAllApplications({ applications }: Props) {
  const { t } = useTranslation();

  const tableColumns = [
    { content: '#', sortable: true, hideSortButton: true },
    { content: t(KEY.common_recruitmentposition), sortable: true, hideSortButton: true },
    { content: t(KEY.common_gang), sortable: true, hideSortButton: true },
    { content: t(KEY.recruitment_recruiter_status), sortable: true, hideSortButton: true },
    { content: t(KEY.recruitment_interview_time), sortable: true, hideSortButton: true },
  ];
  function applicationToRow(application: RecruitmentApplicationDto) {
    return {
      cells: [
        {
          value: application.applicant_priority,
          content: (
            <Link
              target="frontend"
              url={reverse({
                pattern: ROUTES.frontend.admin_recruitment_applicant,
                urlParams: {
                  applicationID: application.id,
                },
              })}
            >
              {application.applicant_priority}
            </Link>
          ),
        },
        {
          value: dbT(application.recruitment_position, 'name'),
          content: (
            <Link
              target="frontend"
              url={reverse({
                pattern: ROUTES.frontend.admin_recruitment_applicant,
                urlParams: {
                  applicationID: application.id,
                },
              })}
            >
              {dbT(application.recruitment_position, 'name')}
            </Link>
          ),
        },
        {
          content: (
            <Link
              url={reverse({
                pattern: ROUTES.frontend.information_page_detail,
                urlParams: { slugField: application.recruitment_position.gang.name_nb.toLowerCase() },
              })}
            >
              {dbT(application.recruitment_position.gang, 'name')}
            </Link>
          ),
        },
        application.recruiter_priority ? application.recruiter_priority : t(KEY.common_not_set),
        application.interview_time ? application.interview_time : t(KEY.common_not_set),
      ],
    };
  }

  return (
    <Table
      columns={tableColumns}
      data={applications ? applications.map((application) => applicationToRow(application)) : []}
    />
  );
}
