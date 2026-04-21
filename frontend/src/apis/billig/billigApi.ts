import axios from 'axios';
import { BACKEND_DOMAIN } from '~/constants';
import { ROUTES } from '~/routes';

type PrepareBilligPurchaseArgs = {
  eventId: number;
  ticketQuantities: Record<number, number>;
  selectedSeats?: Record<number, number[]>;
  email?: string;
  membercard?: string;
};

type PrepareBilligPurchaseResponse = {
  success: boolean;
  form_data: Record<string, string | number>;
  payment_url: string;
};

export async function prepareBilligPurchase({
  eventId,
  ticketQuantities,
  selectedSeats,
  email,
  membercard,
}: PrepareBilligPurchaseArgs): Promise<PrepareBilligPurchaseResponse> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__purchase;
  const payload: Record<string, string | number> = {
    event_id: eventId,
  };

  for (const [priceGroupId, quantity] of Object.entries(ticketQuantities)) {
    payload[`price_group_${priceGroupId}`] = quantity;
  }

  for (const [ticketGroupId, seatIds] of Object.entries(selectedSeats ?? {})) {
    for (const seatId of seatIds) {
      payload[`seat_${ticketGroupId}_${seatId}`] = 1;
    }
  }

  if (email) {
    payload.email = email;
  }

  if (membercard) {
    payload.membercard = membercard;
  }

  const response = await axios.post<PrepareBilligPurchaseResponse>(url, payload, { withCredentials: true });
  return response.data;
}

export async function testBilligPurchase() {
  const preparedPurchase = await prepareBilligPurchase({
    eventId: 4518,
    ticketQuantities: {
      12737: 2,
      12738: 1,
    },
    email: 'test@example.com',
  });

  submitBilligForm({
    paymentUrl: preparedPurchase.payment_url,
    formData: preparedPurchase.form_data,
  });

  return preparedPurchase;
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
