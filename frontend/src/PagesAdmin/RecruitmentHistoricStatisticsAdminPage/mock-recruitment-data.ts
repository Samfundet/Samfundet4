// applicant numbers //
// - total number of applications for "this" recruitment [x]

// - total number of unique applicantsfor "this" recruitment [x]

// - historic data - last 5 years (indexed)
//   - both V/H

// v17 is baseline
export const indexed_historic_unique_applicants = [
  { label: 'v12', number: 110 },
  { label: 'h12', number: 115 },
  { label: 'v13', number: 110 },
  { label: 'h13', number: 115 },
  { label: 'v14', number: 110 },
  { label: 'h14', number: 115 },
  { label: 'v15', number: 110 },
  { label: 'h15', number: 115 },
  { label: 'v16', number: 110 },
  { label: 'h16', number: 115 },
  { label: 'v17', number: 100 },
  { label: 'h17', number: 120 },
  { label: 'v18', number: 110 },
  { label: 'h18', number: 115 },
  { label: 'v19', number: 110 },
  { label: 'h19', number: 115 },
  { label: 'v20', number: 110 },
  { label: 'h20', number: 135 },
  { label: 'v21', number: 130 },
  { label: 'h21', number: 150 },
  { label: 'v22', number: 110 },
  { label: 'h22', number: 115 },
  { label: 'v23', number: 110 },
  { label: 'h23', number: 115 },
  { label: 'v24', number: 110 },
  { label: 'h24', number: 160 },
  { label: 'v25', number: 110 },
  { label: 'h25', number: 115 },
];

// only V - v17 is baseline
export const indexed_historic_unique_applicants_v = [
  { label: 'v12', number: 110 },
  { label: 'v13', number: 110 },
  { label: 'v14', number: 110 },
  { label: 'v15', number: 110 },
  { label: 'v16', number: 110 },
  { label: 'h16', number: 115 },
  { label: 'v17', number: 100 },
  { label: 'v18', number: 110 },
  { label: 'v19', number: 110 },
  { label: 'v20', number: 110 },
  { label: 'v21', number: 130 },
  { label: 'v22', number: 110 },
  { label: 'v23', number: 110 },
  { label: 'v24', number: 110 },
  { label: 'v25', number: 110 },
];

//  only H - v17 is baseline
export const indexed_historic_unique_applicants_h = [
  { label: 'h12', number: 115 },
  { label: 'h13', number: 115 },
  { label: 'h14', number: 115 },
  { label: 'h15', number: 115 },
  { label: 'h16', number: 115 },
  { label: 'h17', number: 120 },
  { label: 'h18', number: 115 },
  { label: 'h19', number: 115 },
  { label: 'h20', number: 135 },
  { label: 'h21', number: 150 },
  { label: 'h22', number: 115 },
  { label: 'h23', number: 115 },
  { label: 'h24', number: 160 },
  { label: 'h25', number: 115 },
];

// campus numbers percentage distribution
// - pie chart for "this recruitment"  [x]

// campus numbers weighted distribution (antall søkere delt på antall studenter på det campus)
// - pie chart for "this recruitment"
// - streamgraph for historic data
// - line diagram for each campus

/*
 * THIS MOCK DATA IS MEANT TO COMMUNICATE WHAT KIND OF DATA WE NEED
 * FOR THE ACTUALL IMPLEMENTATION WE SHOULD COMPUTE MORE IN BACKEND
 * WEIGHTED NUMBERS SHOULD BE COMPUTED IN BACKEND
 */

export const total_campus_members = [
  {
    label: 'v18',
    data: {
      ntnu_glos: 20000,
      DMMH: 1000,
      BI: 3000,
      ntnu_tunga: 2000,
      ntnu_oya: 4000,
      ntnu_dragvoll: 7000,
      ntnu_hhs: 30000,
    },
  },
  {
    label: 'h18',
    data: {
      ntnu_glos: 20000,
      DMMH: 1000,
      BI: 3000,
      ntnu_tunga: 2000,
      ntnu_oya: 4000,
      ntnu_dragvoll: 7000,
      ntnu_hhs: 30000,
    },
  },
  {
    label: 'v19',
    data: {
      ntnu_glos: 20000,
      DMMH: 1000,
      BI: 3000,
      ntnu_tunga: 2000,
      ntnu_oya: 4000,
      ntnu_dragvoll: 7000,
      ntnu_hhs: 30000,
    },
  },
  {
    label: 'h19',
    data: {
      ntnu_glos: 20000,
      DMMH: 1000,
      BI: 3000,
      ntnu_tunga: 2000,
      ntnu_oya: 4000,
      ntnu_dragvoll: 7000,
      ntnu_hhs: 30000,
    },
  },
  {
    label: 'v20',
    data: {
      ntnu_glos: 20000,
      DMMH: 1000,
      BI: 3000,
      ntnu_tunga: 2000,
      ntnu_oya: 4000,
      ntnu_dragvoll: 7000,
      ntnu_hhs: 30000,
    },
  },
  {
    label: 'h20',
    data: {
      ntnu_glos: 20000,
      DMMH: 1000,
      BI: 3000,
      ntnu_tunga: 2000,
      ntnu_oya: 4000,
      ntnu_dragvoll: 7000,
      ntnu_hhs: 30000,
    },
  },
  {
    label: 'v21',
    data: {
      ntnu_glos: 20000,
      DMMH: 1000,
      BI: 3000,
      ntnu_tunga: 2000,
      ntnu_oya: 4000,
      ntnu_dragvoll: 7000,
      ntnu_hhs: 30000,
    },
  },
  {
    label: 'h21',
    data: {
      ntnu_glos: 20000,
      DMMH: 1000,
      BI: 3000,
      ntnu_tunga: 2000,
      ntnu_oya: 4000,
      ntnu_dragvoll: 7000,
      ntnu_hhs: 30000,
    },
  },
  {
    label: 'v22',
    data: {
      ntnu_glos: 20000,
      DMMH: 1000,
      BI: 3000,
      ntnu_tunga: 2000,
      ntnu_oya: 4000,
      ntnu_dragvoll: 7000,
      ntnu_hhs: 30000,
    },
  },
  {
    label: 'h22',
    data: {
      ntnu_glos: 20000,
      DMMH: 1000,
      BI: 3000,
      ntnu_tunga: 2000,
      ntnu_oya: 4000,
      ntnu_dragvoll: 7000,
      ntnu_hhs: 30000,
    },
  },
  {
    label: 'v23',
    data: {
      ntnu_glos: 20000,
      DMMH: 1000,
      BI: 3000,
      ntnu_tunga: 2000,
      ntnu_oya: 4000,
      ntnu_dragvoll: 7000,
      ntnu_hhs: 30000,
    },
  },
  {
    label: 'h23',
    data: {
      ntnu_glos: 20000,
      DMMH: 1000,
      BI: 3000,
      ntnu_tunga: 2000,
      ntnu_oya: 4000,
      ntnu_dragvoll: 7000,
      ntnu_hhs: 30000,
    },
  },
  {
    label: 'v24',
    data: {
      ntnu_glos: 20000,
      DMMH: 1000,
      BI: 3000,
      ntnu_tunga: 2000,
      ntnu_oya: 4000,
      ntnu_dragvoll: 7000,
      ntnu_hhs: 30000,
    },
  },
  {
    label: 'h24',
    data: {
      ntnu_glos: 20000,
      DMMH: 1000,
      BI: 3000,
      ntnu_tunga: 2000,
      ntnu_oya: 4000,
      ntnu_dragvoll: 7000,
      ntnu_hhs: 30000,
    },
  },
  {
    label: 'v25',
    data: {
      ntnu_glos: 20000,
      DMMH: 1000,
      BI: 3000,
      ntnu_tunga: 2000,
      ntnu_oya: 4000,
      ntnu_dragvoll: 7000,
      ntnu_hhs: 30000,
    },
  },
];

export const unique_applicans_per_campus = [
  {
    label: 'v18',
    data: {
      ntnu_glos: 600,
      DMMH: 300,
      BI: 400,
      ntnu_tunga: 100,
      ntnu_oya: 350,
      ntnu_dragvoll: 400,
      ntnu_hhs: 370,
    },
  },
  {
    label: 'h18',
    data: {
      ntnu_glos: 600,
      DMMH: 300,
      BI: 400,
      ntnu_tunga: 100,
      ntnu_oya: 350,
      ntnu_dragvoll: 400,
      ntnu_hhs: 370,
    },
  },
  {
    label: 'v19',
    data: {
      ntnu_glos: 600,
      DMMH: 300,
      BI: 400,
      ntnu_tunga: 100,
      ntnu_oya: 350,
      ntnu_dragvoll: 400,
      ntnu_hhs: 370,
    },
  },
  {
    label: 'h19',
    data: {
      ntnu_glos: 600,
      DMMH: 300,
      BI: 400,
      ntnu_tunga: 100,
      ntnu_oya: 350,
      ntnu_dragvoll: 400,
      ntnu_hhs: 370,
    },
  },
  {
    label: 'v20',
    data: {
      ntnu_glos: 800,
      DMMH: 200,
      BI: 600,
      ntnu_tunga: 150,
      ntnu_oya: 450,
      ntnu_dragvoll: 100,
      ntnu_hhs: 470,
    },
  },
  {
    label: 'h20',
    data: {
      ntnu_glos: 600,
      DMMH: 300,
      BI: 400,
      ntnu_tunga: 100,
      ntnu_oya: 350,
      ntnu_dragvoll: 400,
      ntnu_hhs: 370,
    },
  },
  {
    label: 'v21',
    data: {
      ntnu_glos: 800,
      DMMH: 200,
      BI: 600,
      ntnu_tunga: 150,
      ntnu_oya: 450,
      ntnu_dragvoll: 100,
      ntnu_hhs: 470,
    },
  },
  {
    label: 'h21',
    data: {
      ntnu_glos: 800,
      DMMH: 200,
      BI: 600,
      ntnu_tunga: 150,
      ntnu_oya: 450,
      ntnu_dragvoll: 100,
      ntnu_hhs: 470,
    },
  },
  {
    label: 'v22',
    data: {
      ntnu_glos: 600,
      DMMH: 300,
      BI: 400,
      ntnu_tunga: 100,
      ntnu_oya: 350,
      ntnu_dragvoll: 400,
      ntnu_hhs: 370,
    },
  },
  {
    label: 'h22',
    data: {
      ntnu_glos: 800,
      DMMH: 200,
      BI: 600,
      ntnu_tunga: 150,
      ntnu_oya: 450,
      ntnu_dragvoll: 100,
      ntnu_hhs: 470,
    },
  },
  {
    label: 'v23',
    data: {
      ntnu_glos: 600,
      DMMH: 300,
      BI: 400,
      ntnu_tunga: 100,
      ntnu_oya: 350,
      ntnu_dragvoll: 400,
      ntnu_hhs: 370,
    },
  },
  {
    label: 'h23',
    data: {
      ntnu_glos: 800,
      DMMH: 200,
      BI: 600,
      ntnu_tunga: 150,
      ntnu_oya: 450,
      ntnu_dragvoll: 100,
      ntnu_hhs: 470,
    },
  },
  {
    label: 'v24',
    data: {
      ntnu_glos: 600,
      DMMH: 300,
      BI: 400,
      ntnu_tunga: 100,
      ntnu_oya: 350,
      ntnu_dragvoll: 400,
      ntnu_hhs: 370,
    },
  },
  {
    label: 'h24',
    data: {
      ntnu_glos: 800,
      DMMH: 200,
      BI: 600,
      ntnu_tunga: 150,
      ntnu_oya: 450,
      ntnu_dragvoll: 100,
      ntnu_hhs: 470,
    },
  },
  {
    label: 'v25',
    data: {
      ntnu_glos: 600,
      DMMH: 300,
      BI: 400,
      ntnu_tunga: 100,
      ntnu_oya: 350,
      ntnu_dragvoll: 400,
      ntnu_hhs: 370,
    },
  },
];
