import { ReservationTableDto } from '~/dto';

export type columns = {
  size: number;
  reservation?: ReservationTableDto; // TODO replace with object
};
