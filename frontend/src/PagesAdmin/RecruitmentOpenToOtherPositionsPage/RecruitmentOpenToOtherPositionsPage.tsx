import { useTitle } from '~/hooks';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import { t } from 'i18next';
import { KEY } from '~/i18n/constants';
import { OpenToOtherPositionsTable } from './OpenToOtherPositionsTable/OpenToOtherPositionsTable';
import { useEffect, useState } from 'react';
import { RecruitmentUserDto } from '~/dto';

export function RecruitmentOpenToOtherPositionsPage() {
  useTitle('Tester');
  console.log('hei');

  const [users, setUsers] = useState<RecruitmentUserDto[]>([]);
  useEffect(() => {
    //TODO: get users after API-calls have been made
    //Meanwhile test users:
    const testData: RecruitmentUserDto[] = [
      {
        id: 1,
        username: 'JohnDoe',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone_number: '1234567890',
        recruitment_application_ids: [],
        applications: [],
        applications_without_interview: [],
      },
      {
        id: 2,
        username: 'JaneSmith',
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com',
        phone_number: '9876543210',
        recruitment_application_ids: [],
        applications: [],
        applications_without_interview: [],
      },
    ];
    setUsers(testData);
    console.log(users);
  }, [users]);

  const header = <p>Søkere som er reservert må/bør klareres med gjengen som har reservert søkeren.</p>;

  return (
    <>
      <AdminPageLayout title={t(KEY.recruitment_applicants_open_to_other_positions)} header={header}>
        <OpenToOtherPositionsTable applicants={users}></OpenToOtherPositionsTable>
      </AdminPageLayout>
    </>
  );
}
