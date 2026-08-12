export type BilligPriceGroupDto = {
  id: number;
  name: string;
  can_be_put_on_card: boolean;
  membership_needed: boolean;
  netsale: boolean;
  price: number;

  // Ticket fee (included in price)
  ticket_fee?: number;
};

export type BilligTicketGroupDto = {
  id: number;
  name: string;
  is_sold_out: boolean;
  is_almost_sold_out: boolean;
  is_theater_ticket_group: boolean;
  ticket_limit: number | null;
  price_groups: BilligPriceGroupDto[];
};

export type BilligEventDto = {
  id: number;
  name: string;
  payment_url: string;
  ticket_groups: BilligTicketGroupDto[];
  sale_from: string;
  sale_to: string;
  in_sale_period: string;
  is_almost_sold_out: boolean;
  is_sold_out: boolean;
};

export type BilligPaymentErrorRowDto = {
  price_group: number;
  number_of_tickets: number;
};

export type BilligPurchaseFailureDto = {
  found: boolean;
  retry_possible: boolean;
  message: string;
  owner_cardno: string | null;
  owner_email: string | null;
  cart_rows: BilligPaymentErrorRowDto[];
  event_id: number | null;
};
