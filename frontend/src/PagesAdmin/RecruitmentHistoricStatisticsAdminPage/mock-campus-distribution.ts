// campus numbers percentage distribution

// campus numbers weighted distribution (antall søkere delt på antall studenter på det campus)
// - line diagram for each campus

/*
 * THIS MOCK DATA IS MEANT TO COMMUNICATE WHAT KIND OF DATA WE NEED FOR THE ACTUALL IMPLEMENTATION
 * WEIGHTED NUMBERS SHOULD BE COMPUTED IN BACKEND
 */

interface CampusApplicantData {
  label: string;
  applicants: number;
  student_campus_count: number;
}

interface SemesterCampusData {
  semester: string;
  campus_applicant_data: CampusApplicantData[];
}

export type CampusApplicantDataset = SemesterCampusData[];

export const mock_campus_applicant_data: CampusApplicantDataset = [
  {
    semester: 'v18',
    campus_applicant_data: [
      { label: 'Gløs', applicants: 600, student_campus_count: 20000 },
      { label: 'DMMH', applicants: 300, student_campus_count: 1000 },
      { label: 'BI', applicants: 400, student_campus_count: 3000 },
      { label: 'Tunga', applicants: 100, student_campus_count: 2000 },
      { label: 'Øya', applicants: 350, student_campus_count: 4000 },
      { label: 'Dragvoll', applicants: 400, student_campus_count: 7000 },
      { label: 'HHS', applicants: 370, student_campus_count: 3000 },
    ],
  },
  {
    semester: 'h18',
    campus_applicant_data: [
      { label: 'Gløs', applicants: 600, student_campus_count: 20000 },
      { label: 'DMMH', applicants: 300, student_campus_count: 1000 },
      { label: 'BI', applicants: 400, student_campus_count: 3000 },
      { label: 'Tunga', applicants: 100, student_campus_count: 2000 },
      { label: 'Øya', applicants: 350, student_campus_count: 4000 },
      { label: 'Dragvoll', applicants: 400, student_campus_count: 7000 },
      { label: 'HHS', applicants: 370, student_campus_count: 3000 },
    ],
  },
  {
    semester: 'v19',
    campus_applicant_data: [
      { label: 'Gløs', applicants: 600, student_campus_count: 20000 },
      { label: 'DMMH', applicants: 300, student_campus_count: 1000 },
      { label: 'BI', applicants: 400, student_campus_count: 3000 },
      { label: 'Tunga', applicants: 100, student_campus_count: 2000 },
      { label: 'Øya', applicants: 350, student_campus_count: 4000 },
      { label: 'Dragvoll', applicants: 400, student_campus_count: 7000 },
      { label: 'HHS', applicants: 370, student_campus_count: 3000 },
    ],
  },
  {
    semester: 'h19',
    campus_applicant_data: [
      { label: 'Gløs', applicants: 600, student_campus_count: 20000 },
      { label: 'DMMH', applicants: 300, student_campus_count: 1000 },
      { label: 'BI', applicants: 400, student_campus_count: 3000 },
      { label: 'Tunga', applicants: 100, student_campus_count: 2000 },
      { label: 'Øya', applicants: 350, student_campus_count: 4000 },
      { label: 'Dragvoll', applicants: 400, student_campus_count: 7000 },
      { label: 'HHS', applicants: 370, student_campus_count: 3000 },
    ],
  },
  {
    semester: 'v20',
    campus_applicant_data: [
      { label: 'Gløs', applicants: 800, student_campus_count: 20000 },
      { label: 'DMMH', applicants: 200, student_campus_count: 1000 },
      { label: 'BI', applicants: 600, student_campus_count: 3000 },
      { label: 'Tunga', applicants: 150, student_campus_count: 2000 },
      { label: 'Øya', applicants: 450, student_campus_count: 4000 },
      { label: 'Dragvoll', applicants: 100, student_campus_count: 7000 },
      { label: 'HHS', applicants: 470, student_campus_count: 3000 },
    ],
  },
  {
    semester: 'h20',
    campus_applicant_data: [
      { label: 'Gløs', applicants: 600, student_campus_count: 20000 },
      { label: 'DMMH', applicants: 300, student_campus_count: 1000 },
      { label: 'BI', applicants: 400, student_campus_count: 3000 },
      { label: 'Tunga', applicants: 100, student_campus_count: 2000 },
      { label: 'Øya', applicants: 350, student_campus_count: 4000 },
      { label: 'Dragvoll', applicants: 400, student_campus_count: 7000 },
      { label: 'HHS', applicants: 370, student_campus_count: 3000 },
    ],
  },
  {
    semester: 'v21',
    campus_applicant_data: [
      { label: 'Gløs', applicants: 800, student_campus_count: 20000 },
      { label: 'DMMH', applicants: 200, student_campus_count: 1000 },
      { label: 'BI', applicants: 600, student_campus_count: 3000 },
      { label: 'Tunga', applicants: 150, student_campus_count: 2000 },
      { label: 'Øya', applicants: 450, student_campus_count: 4000 },
      { label: 'Dragvoll', applicants: 100, student_campus_count: 7000 },
      { label: 'HHS', applicants: 470, student_campus_count: 3000 },
    ],
  },
  {
    semester: 'h21',
    campus_applicant_data: [
      { label: 'Gløs', applicants: 800, student_campus_count: 20000 },
      { label: 'DMMH', applicants: 200, student_campus_count: 1000 },
      { label: 'BI', applicants: 600, student_campus_count: 3000 },
      { label: 'Tunga', applicants: 150, student_campus_count: 2000 },
      { label: 'Øya', applicants: 450, student_campus_count: 4000 },
      { label: 'Dragvoll', applicants: 100, student_campus_count: 7000 },
      { label: 'HHS', applicants: 470, student_campus_count: 3000 },
    ],
  },
  {
    semester: 'v22',
    campus_applicant_data: [
      { label: 'Gløs', applicants: 600, student_campus_count: 20000 },
      { label: 'DMMH', applicants: 300, student_campus_count: 1000 },
      { label: 'BI', applicants: 400, student_campus_count: 3000 },
      { label: 'Tunga', applicants: 100, student_campus_count: 2000 },
      { label: 'Øya', applicants: 350, student_campus_count: 4000 },
      { label: 'Dragvoll', applicants: 400, student_campus_count: 7000 },
      { label: 'HHS', applicants: 370, student_campus_count: 3000 },
    ],
  },
  {
    semester: 'h22',
    campus_applicant_data: [
      { label: 'Gløs', applicants: 800, student_campus_count: 20000 },
      { label: 'DMMH', applicants: 200, student_campus_count: 1000 },
      { label: 'BI', applicants: 600, student_campus_count: 3000 },
      { label: 'Tunga', applicants: 150, student_campus_count: 2000 },
      { label: 'Øya', applicants: 450, student_campus_count: 4000 },
      { label: 'Dragvoll', applicants: 100, student_campus_count: 7000 },
      { label: 'HHS', applicants: 470, student_campus_count: 3000 },
    ],
  },
  {
    semester: 'v23',
    campus_applicant_data: [
      { label: 'Gløs', applicants: 600, student_campus_count: 20000 },
      { label: 'DMMH', applicants: 300, student_campus_count: 1000 },
      { label: 'BI', applicants: 400, student_campus_count: 3000 },
      { label: 'Tunga', applicants: 100, student_campus_count: 2000 },
      { label: 'Øya', applicants: 350, student_campus_count: 4000 },
      { label: 'Dragvoll', applicants: 400, student_campus_count: 7000 },
      { label: 'HHS', applicants: 370, student_campus_count: 3000 },
    ],
  },
  {
    semester: 'h23',
    campus_applicant_data: [
      { label: 'Gløs', applicants: 800, student_campus_count: 20000 },
      { label: 'DMMH', applicants: 200, student_campus_count: 1000 },
      { label: 'BI', applicants: 600, student_campus_count: 3000 },
      { label: 'Tunga', applicants: 150, student_campus_count: 2000 },
      { label: 'Øya', applicants: 450, student_campus_count: 4000 },
      { label: 'Dragvoll', applicants: 100, student_campus_count: 7000 },
      { label: 'HHS', applicants: 470, student_campus_count: 3000 },
    ],
  },
  {
    semester: 'v24',
    campus_applicant_data: [
      { label: 'Gløs', applicants: 600, student_campus_count: 20000 },
      { label: 'DMMH', applicants: 300, student_campus_count: 1000 },
      { label: 'BI', applicants: 400, student_campus_count: 3000 },
      { label: 'Tunga', applicants: 100, student_campus_count: 2000 },
      { label: 'Øya', applicants: 350, student_campus_count: 4000 },
      { label: 'Dragvoll', applicants: 400, student_campus_count: 7000 },
      { label: 'HHS', applicants: 370, student_campus_count: 3000 },
    ],
  },
  {
    semester: 'h24',
    campus_applicant_data: [
      { label: 'Gløs', applicants: 800, student_campus_count: 20000 },
      { label: 'DMMH', applicants: 200, student_campus_count: 1000 },
      { label: 'BI', applicants: 600, student_campus_count: 3000 },
      { label: 'Tunga', applicants: 150, student_campus_count: 2000 },
      { label: 'Øya', applicants: 450, student_campus_count: 4000 },
      { label: 'Dragvoll', applicants: 100, student_campus_count: 7000 },
      { label: 'HHS', applicants: 470, student_campus_count: 3000 },
    ],
  },
  {
    semester: 'v25',
    campus_applicant_data: [
      { label: 'Gløs', applicants: 600, student_campus_count: 20000 },
      { label: 'DMMH', applicants: 300, student_campus_count: 1000 },
      { label: 'BI', applicants: 400, student_campus_count: 3000 },
      { label: 'Tunga', applicants: 100, student_campus_count: 2000 },
      { label: 'Øya', applicants: 350, student_campus_count: 4000 },
      { label: 'Dragvoll', applicants: 400, student_campus_count: 7000 },
      { label: 'HHS', applicants: 370, student_campus_count: 3000 },
    ],
  },
];
