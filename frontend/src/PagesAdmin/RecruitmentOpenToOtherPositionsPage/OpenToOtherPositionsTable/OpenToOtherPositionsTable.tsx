import { useTranslation } from 'react-i18next';
import { Table } from '~/Components';
import type { RecruitmentApplicationDto, RecruitmentPositionDto, RecruitmentUserDto } from '~/dto';
import { KEY } from '~/i18n/constants';

type OpenTableProps = {
  applicants: RecruitmentUserDto[];
};

export function OpenToOtherPositionsTable({ applicants }: OpenTableProps) {
  const { t } = useTranslation();
  const tableColumns = [
    { content: t(KEY.common_name), sortable: true },
    { content: t(KEY.common_phonenumber), sortable: true },
    { content: t(KEY.common_email), sortable: true },
  ];

  function positionToTableRow(position: RecruitmentPositionDto) {
    return ['', position.gang.name_en, position.name_en];
  }

  const data = applicants.map((applicant) => {
    return {
      cells: [
        { value: `${applicant.first_name} ${applicant.last_name}` },
        { value: applicant.phone_number },
        { value: applicant.email },
      ],
      childTable: {
        columns: [
          { content: t(KEY.common_gang), sortable: true },
          { content: t(KEY.recruitment_position), sortable: true },
        ],
        data: applicant.applications.map((application: RecruitmentApplicationDto) => {
          return {
            cells: positionToTableRow(application.recruitment_position),
          };
        }),
      },
    };
  });

  return <Table columns={tableColumns} data={data} />;
}
