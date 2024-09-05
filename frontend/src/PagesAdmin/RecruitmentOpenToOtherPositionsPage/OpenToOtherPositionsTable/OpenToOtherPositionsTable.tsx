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
  return (
    <table>
      <thead>
        <tr>
          <th>{firstName + lastName}</th>
          <th>{phoneNumber}</th>
          <th>{email}</th>
        </tr>
      </thead>
      <tbody>
        {positions.map((position, index) => (
          <tr key={index}>
            <td></td>
            <td>{position.gang.name_en}</td>
            <td>{position.name_en}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
