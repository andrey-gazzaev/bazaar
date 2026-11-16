import axios, { isAxiosError } from 'axios';

/** HTTP client for the shop API. Sends the session cookie. */
export const api = axios.create({ withCredentials: true });

api.interceptors.response.use(undefined, (error: unknown) => {
  if (!isAxiosError(error) || error.code === 'ERR_CANCELED') return Promise.reject(error);

  const body: unknown = error.response?.data;
  const message =
    body && typeof body === 'object' && 'message' in body && typeof body.message === 'string' ? body.message : null;
  const status = error.response?.status;

  return Promise.reject(new Error(message ?? (status != null ? `Запрос не удался (${status})` : 'Запрос не удался')));
});
