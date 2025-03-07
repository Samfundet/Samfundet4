export type ReservationCheckAvailabilityDto = {
  reservation_date: string; // Required
  guest_count: number; // Required
};

export type AvailableTimes = string[];
