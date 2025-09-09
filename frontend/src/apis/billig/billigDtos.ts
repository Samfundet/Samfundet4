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
  ticket_limit: number;
  price_groups: BilligPriceGroupDto[];
};

export type BilligEventDto = {
  id: number;
  name: string;
  ticket_groups: BilligTicketGroupDto[];
  sale_from: string;
  sale_to: string;
  in_same_period: string;
  is_almost_sold_out: boolean;
  is_sold_out: boolean;
};
