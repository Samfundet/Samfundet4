// @ts-nocheck
// TODO: Remove previous line after making page dynamic and remove all mocks
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import type { RecruitmentUserDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import { OpenToOtherPositionsTable } from './OpenToOtherPositionsTable/OpenToOtherPositionsTable';

export function RecruitmentOpenToOtherPositionsPage() {
  useTitle('Tester');
  console.log('hei');

  const [applicants, setApplicants] = useState<RecruitmentUserDto[]>([]);
  useEffect(() => {
    //TODO: get applicants in issue #1105
    //Meanwhile test applicants mock data:
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
              id: 0,
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
              id: 1,
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
    setApplicants(testData);
  }, []);

  const header = <p>Søkere som er reservert må/bør klareres med gjengen som har reservert søkeren.</p>;
  return (
    <>
      <AdminPageLayout title={t(KEY.recruitment_applicants_open_to_other_positions)} header={header}>
        <OpenToOtherPositionsTable applicants={applicants} />
      </AdminPageLayout>
    </>
  );
}
