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
        applications: [
          {
            id: '101',
            recruitment_position: {
              name_nb: 'Utvikler',
              name_en: 'Developer',
              id: '',
              short_description_nb: '',
              short_description_en: '',
              long_description_nb: '',
              long_description_en: '',
              is_funksjonaer_position: false,
              norwegian_applicants_only: false,
              default_application_letter_nb: '',
              default_application_letter_en: '',
              gang: {
                id: 0,
                name_nb: 'Markedsføringsgjengen',
                name_en: 'Markedsføringsgjengen',
                abbreviation: '',
                webpage: undefined,
                logo: undefined,
                gang_type: undefined,
                info_page: undefined,
              },
              recruitment: '',
              tags: '',
            },
            status: 'Pending',
          },
          {
            id: '102',
            recruitment_position: {
              name_nb: 'SoMe-gjengis',
              name_en: 'SoMe-gjengis',
              id: '',
              short_description_nb: '',
              short_description_en: '',
              long_description_nb: '',
              long_description_en: '',
              is_funksjonaer_position: false,
              norwegian_applicants_only: false,
              default_application_letter_nb: '',
              default_application_letter_en: '',
              gang: {
                id: 0,
                name_nb: 'Markedsføringsgjengen',
                name_en: 'Markedsføringsgjengen',
                abbreviation: '',
                webpage: undefined,
                logo: undefined,
                gang_type: undefined,
                info_page: undefined,
              },
              recruitment: '',
              tags: '',
            },
            status: 'Pending',
          },
        ],
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
        applications: [
          {
            id: '103',
            recruitment_position: {
              name_nb: 'Gjengmedlem',
              name_en: 'Gjengmedlem',
              id: '',
              short_description_nb: '',
              short_description_en: '',
              long_description_nb: '',
              long_description_en: '',
              is_funksjonaer_position: false,
              norwegian_applicants_only: false,
              default_application_letter_nb: '',
              default_application_letter_en: '',
              gang: {
                id: 0,
                name_nb: 'Lørdagskomiteén',
                name_en: 'Lørdagskomiteén',
                abbreviation: '',
                webpage: undefined,
                logo: undefined,
                gang_type: undefined,
                info_page: undefined,
              },
              recruitment: '',
              tags: '',
            },
            status: 'Pending',
          },
        ],
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
