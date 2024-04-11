import { ReservationTableDto } from '~/dto';
export const TABLES_TEST_DATA = [
  {
    id: 1,
    name_nb: 'Bord 1',
    description_nb: 'Dette er bord 1',
    name_en: 'table 1',
    description_en: 'this is table 1',
    seating: 4,
    reservations: [
      {
        start_time: '12:30',
        end_time: '13:00',
        name: 'Jørgen',
      },
      {
        start_time: '17:30',
        end_time: '18:00',
        name: 'Hannah',
      },
      {
        start_time: '11:15',
        end_time: '12:15',
        name: 'Magnus',
      },
    ] as ReservationTableDto[],
  },
  {
    id: 2,
    name_nb: 'Bord 2',
    description_nb: 'Dette er bord 2',
    name_en: 'table 2',
    description_en: 'this is table 2',
    seating: 8,
  },
  {
    id: 3,
    name_nb: 'Bord 3',
    description_nb: 'Dette er bord 3',
    name_en: 'table 3',
    description_en: 'this is table 3',
    seating: 2,
    reservations: [
      {
        start_time: '14:30',
        end_time: '16:15',
        name: 'Jørgen',
      },
    ] as ReservationTableDto[],
  },
];
