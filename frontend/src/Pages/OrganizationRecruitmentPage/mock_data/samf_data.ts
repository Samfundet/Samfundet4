import { OrganizationRecruitmentDto } from '~/dto';

export const samf_recruitment_mock_data: OrganizationRecruitmentDto = {
  id: '1',
  organization: 'samfundet',
  recruiting_gang_types: [
    {
      id: 1,
      title_nb: 'Drift',
      title_en: 'tfirD🇬🇧',
      gangs: [
        {
          id: 2,
          name_en: 'Marketing🇬🇧',
          name_nb: 'Markedsføringsgjengen',
          abbreviation: 'MG',
          sections: [
            {
              id: 3,
              section_name_nb: 'web',
              recruitment_positions: [
                {
                  id: '4',
                  name_nb: 'webutvikler',
                  name_en: 'webdeveloper🇬🇧',
                  short_description_en: 'create samfundet website🇬🇧',
                  short_description_nb: 'lag samfundets nettside',
                  is_funksjonaer_position: true,
                  tags: 'webdevelopment, react',
                },
                {
                  id: '6',
                  name_en: 'Head of SoME🇬🇧',
                  name_nb: 'SoMe-ansvarlig',
                  short_description_en: 'Post on IG',
                  short_description_nb: 'lag samfundets nettside',
                  is_funksjonaer_position: false,
                  tags: 'instagram, some',
                },
              ],
            },
            {
              id: 5,
              section_name_nb: 'redkasjonen',
              recruitment_positions: [
                {
                  id: '69',
                  name_en: 'Head of SoME🇬🇧',
                  name_nb: 'SoMe-ansvarlig',
                  short_description_en: 'Post on IG',
                  short_description_nb: 'lag samfundets nettside',
                  is_funksjonaer_position: false,
                  tags: 'instagram, some',
                },
              ],
            },
          ],
        },
        {
          id: 20,
          name_en: 'KSG🇬🇧',
          name_nb: 'GSK',
          abbreviation: 'KSG',
          sections: [
            {
              id: 21,
              section_name_nb: 'Servitør',
              recruitment_positions: [
                {
                  id: '50',
                  name_nb: 'test',
                  name_en: 'test-en🇬🇧',
                  short_description_en: 'create samfundet website🇬🇧',
                  short_description_nb: 'lag samfundets nettside',
                  is_funksjonaer_position: true,
                  tags: 'webdevelopment, react',
                },
              ],
            },
            {
              id: 22,
              section_name_nb: 'Bartender',
              recruitment_positions: [
                {
                  id: '51',
                  name_en: 'Head of SoME🇬🇧',
                  name_nb: 'SoMe-ansvarlig',
                  short_description_en: 'Post on IG🇬🇧',
                  short_description_nb: 'lag samfundets nettside',
                  is_funksjonaer_position: false,
                  tags: 'instagram, some',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 7,
      title_nb: 'Media',
      title_en: 'Media🇬🇧',
      gangs: [
        {
          id: 8,
          name_en: 'Studentmedia🇬🇧',
          name_nb: 'Studentmediene',
          abbreviation: 'SM',
          sections: [
            {
              id: 9,
              section_name_nb: 'UD-WEB',
              recruitment_positions: [
                {
                  id: '10',
                  name_nb: 'frontendutvikler',
                  name_en: 'frontend developer🇬🇧',
                  short_description_en: 'create UD website',
                  short_description_nb: 'lag UD nettside',
                  is_funksjonaer_position: false,
                  tags: 'webdevelopment, react',
                },
              ],
            },
            {
              id: 11,
              section_name_nb: 'UD-redaksjon',
              recruitment_positions: [
                {
                  id: '12',
                  name_en: 'Head of redaksjonen🇬🇧',
                  name_nb: 'Ansvarlig for redaksjon',
                  short_description_en: 'Ansvarlig for det redaksjonelt innhold i UD🇬🇧',
                  short_description_nb: 'Responsible for det redaksjonelt innhold i UD',
                  is_funksjonaer_position: true,
                  tags: 'avis, media',
                },
              ],
            },
            {
              id: 13,
              section_name_nb: 'iBok',
              recruitment_positions: [
                {
                  id: '3',
                  name_en: 'iBok backend developer🇬🇧',
                  name_nb: 'iBok backend utvikler',
                  short_description_en: 'Develop in the app iBok🇬🇧',
                  short_description_nb: 'Utvikle iBok app',
                  is_funksjonaer_position: false,
                  tags: 'webdevelopment, flutter',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
