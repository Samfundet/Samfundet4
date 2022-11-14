import axios from 'axios';
import { PermissionDto, UserDto } from '~/dto';
import { ROUTES } from '~/routes';

const TEMP_DOMAIN = 'http://localhost:8000';

export async function getCsrfToken(): Promise<string> {
  const url = TEMP_DOMAIN + ROUTES.backend.samfundet__csrf;
  const response = await axios.get(url, { withCredentials: true });
  return response.data;
}

export async function login(username: string, password: string): Promise<number> {
  // TODO: might not need to fetch token everytime.
  axios.defaults.headers.common['X-CSRFToken'] = await getCsrfToken();
  const url = TEMP_DOMAIN + ROUTES.backend.samfundet__login;
  const data = { username, password };
  const response = await axios.post(url, data, { withCredentials: true });
  const new_token = response.data;
  axios.defaults.headers.common['X-CSRFToken'] = new_token;

  return response.status;
}

export async function logout(): Promise<unknown> {
  const url = TEMP_DOMAIN + ROUTES.backend.samfundet__logout;
  const response = await axios.post(url, undefined, { withCredentials: true });

  return response;
}

export async function getAllPermissions(): Promise<PermissionDto[]> {
  const url = TEMP_DOMAIN + ROUTES.backend.samfundet__permissions;
  const response = await axios.get<PermissionDto[]>(url, { withCredentials: true });

  return response.data;
}

export async function getUser(): Promise<UserDto> {
  const url = TEMP_DOMAIN + ROUTES.backend.samfundet__user;
  const response = await axios.get<UserDto>(url, { withCredentials: true });

  return response.data;
}
