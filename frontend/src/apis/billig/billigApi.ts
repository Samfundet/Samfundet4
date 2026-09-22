import axios from 'axios';
import { BACKEND_DOMAIN } from '~/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import type { BilligCheckoutTicketGroupDto } from './billigDtos';

export async function getBilligCheckoutTickets(billigEventId: number): Promise<BilligCheckoutTicketGroupDto[]> {
  const url =
    BACKEND_DOMAIN +
    reverse({ pattern: ROUTES.backend.samfundet__event_tickets, urlParams: { eventId: billigEventId } });
  const response = await axios.get<BilligCheckoutTicketGroupDto[]>(url, { withCredentials: true });
  return response.data;
}

type BuildBilligFormDataArgs = {
  ticketQuantities: Record<number, number>;
  email?: string;
  membercard?: string;
};

export function buildBilligFormData({
  ticketQuantities,
  email,
  membercard,
}: BuildBilligFormDataArgs): Record<string, string | number> {
  const formData: Record<string, string | number> = {};

  for (const [priceGroupId, quantity] of Object.entries(ticketQuantities)) {
    formData[`price_${priceGroupId}_count`] = quantity;
  }

  if (email) {
    formData.ticket_type = 'paper';
    formData.email = email;
  }

  if (membercard) {
    formData.ticket_type = 'card';
    formData.membercard = membercard;
  }

  return formData;
}

export function submitBilligForm({
  paymentUrl,
  formData,
}: {
  paymentUrl: string;
  formData: Record<string, string | number>;
}) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = paymentUrl;

  for (const [key, value] of Object.entries(formData)) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = String(value);
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}
