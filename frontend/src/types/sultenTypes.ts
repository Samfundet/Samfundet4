// Backend accepted values for reservation occasion
export const ReservationOccation = {
  DRINK: 'DRINK',
  EAT: 'FOOD',
} as const;

export type ReservationOccationValues = (typeof ReservationOccation)[keyof typeof ReservationOccation];

export const allReservationOccationValues = Object.values(ReservationOccation) as ReservationOccationValues[];
