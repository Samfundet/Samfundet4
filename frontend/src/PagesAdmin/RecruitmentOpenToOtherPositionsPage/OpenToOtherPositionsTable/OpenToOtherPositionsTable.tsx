import { Table } from '~/Components';
import { RecruitmentApplicationDto, RecruitmentPositionDto } from '~/dto';

type OpenTableProps = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  applications: RecruitmentApplicationDto[];
};

export function OpenToOtherPositionsTable({ firstName, lastName, phoneNumber, email, applications }: OpenTableProps) {
  const positions: RecruitmentPositionDto[] = [];

  applications.forEach((application) => {
    positions.push(application.recruitment_position);
  });

  const tableColumns = [
    { content: firstName + lastName, sortable: true },
    { content: phoneNumber, sortable: true },
    { content: email, sortable: true },
  ];

  function positionToTableRow(position: RecruitmentPositionDto) {
    return ['', position.gang.name_en, position.name_en];
  }

  return <Table columns={tableColumns} data={positions.map((position) => positionToTableRow(position))}></Table>;
}
