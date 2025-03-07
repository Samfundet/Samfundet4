// Backend accepted values for reservation occasion
export const ReservationOccation = {
  DRINK: 'DRINK',
  EAT: 'FOOD',
};

export type ReservationOccationValues = (typeof ReservationOccation)[keyof typeof ReservationOccation];

export const allReservationOccationValues = Object.keys(ReservationOccation) as ReservationOccationValues[];
