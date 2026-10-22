export type BilligPriceGroupDto = {
  id: number;
  name: string;
  can_be_put_on_card: boolean;
  membership_needed: boolean;
  netsale: boolean;
  price: number;
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

export type BilligCheckoutTicketGroupDto = {
  id: number;
  name: string;
  is_sold_out: boolean;
  is_almost_sold_out: boolean;
  ticket_limit: number | null;
  per_price_group_limit: number;
  group_limit: number;
  price_groups: Omit<BilligPriceGroupDto, 'netsale'>[];
};

export type BilligEventDto = {
  id: number;
  name: string;
  payment_url: string;
  ticket_fee: number | null;
  ticket_groups: BilligTicketGroupDto[];
  sale_from: string;
  sale_to: string;
  in_sale_period: boolean;
  is_almost_sold_out: boolean;
  is_sold_out: boolean;
};
