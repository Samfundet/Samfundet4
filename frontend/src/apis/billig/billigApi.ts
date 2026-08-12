import axios from 'axios';
import { BACKEND_DOMAIN } from '~/constants';
import { ROUTES } from '~/routes';
import type { BilligPurchaseFailureDto, BilligPurchaseSuccessDto } from './billigDtos';

export const BILLIG_PURCHASE_CONTEXT_KEY = 'billig-purchase-context';

type BuildBilligFormDataArgs = {
  ticketQuantities: Record<number, number>;
  selectedSeats?: Record<number, number[]>;
  email?: string;
  membercard?: string;
};

export function buildBilligFormData({
  ticketQuantities,
  selectedSeats,
  email,
  membercard,
}: BuildBilligFormDataArgs): Record<string, string | number> {
  const formData: Record<string, string | number> = {};

  for (const [priceGroupId, quantity] of Object.entries(ticketQuantities)) {
    formData[`price_${priceGroupId}_count`] = quantity;
  }

  for (const [ticketGroupId, seatIds] of Object.entries(selectedSeats ?? {})) {
    for (const seatId of seatIds) {
      formData[`seat_${ticketGroupId}_${seatId}`] = 1;
    }
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

export async function getBilligPurchaseSuccess(tickets: string): Promise<BilligPurchaseSuccessDto> {
  const url = `${BACKEND_DOMAIN}${ROUTES.backend.samfundet__purchase_success_data}?tickets=${encodeURIComponent(tickets)}`;
  const response = await axios.get<BilligPurchaseSuccessDto>(url, { withCredentials: true });
  return response.data;
}

export async function getBilligPurchaseFailure(bsession: string): Promise<BilligPurchaseFailureDto> {
  const url = `${BACKEND_DOMAIN}${ROUTES.backend.samfundet__purchase_failure_data}?bsession=${encodeURIComponent(bsession)}`;
  const response = await axios.get<BilligPurchaseFailureDto>(url, { withCredentials: true });
  return response.data;
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
