import { ReservationTableDto } from '~/dto';

export type Column = {
  size: number;
  reservation?: ReservationTableDto;
};
