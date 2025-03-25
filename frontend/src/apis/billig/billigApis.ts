import axios from 'axios';
import { BACKEND_DOMAIN } from '~/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import type { BilligEventDto, BilligPriceGroupDto, BilligTicketGroupDto } from './billigDtos';

const BILLIG_BASE_URL = 'BILLIG.ITK'; // for production we will use something like this?

export async function getBilligPriceGroups(): Promise<BilligPriceGroupDto[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__billig_event_list;
  const response = await axios.get<BilligPriceGroupDto[]>(url, { withCredentials: true });
  return response.data;
}
export async function getBilligPriceGroup(id: number): Promise<BilligPriceGroupDto> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__billig_price_group_detail, urlParams: { pk: id } });
  const response = await axios.get<BilligPriceGroupDto>(url, { withCredentials: true });
  return response.data;
}

export async function getBilligTicketGroups(): Promise<BilligTicketGroupDto[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__billig_ticket_group_list;
  const response = await axios.get<BilligTicketGroupDto[]>(url, { withCredentials: true });
  return response.data;
}
export async function getBilligTicketGroup(id: number): Promise<BilligPriceGroupDto> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__billig_ticket_group_detail, urlParams: { pk: id } });
  const response = await axios.get<BilligPriceGroupDto>(url, { withCredentials: true });
  return response.data;
}

export async function getBilligEvents(): Promise<BilligEventDto[]> {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__billig_event_list;
  const response = await axios.get<BilligEventDto[]>(url, { withCredentials: true });
  return response.data;
}

export async function getBilligEvent(id: number): Promise<BilligEventDto> {
  const url =
    BACKEND_DOMAIN + reverse({ pattern: ROUTES.backend.samfundet__billig_event_detail, urlParams: { pk: id } });
  const response = await axios.get<BilligEventDto>(url, { withCredentials: true });
  return response.data;
}
