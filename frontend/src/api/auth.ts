import type { LoginRequest, RegisterRequest, AuthResponse } from '../types';

const BASE_URL = '/api';

async function request<T>(url: string, data?: object): Promise<T> {
  const token = localStorage.getItem('token');

  const response = await fetch(`${BASE_URL}${url}`, {
    method: data ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw { response: { data: error } };
  }

  return response.json();
}

export const authApi = {
  login: (data: LoginRequest) =>
    request<AuthResponse>('/auth/login', data),

  register: (data: RegisterRequest) =>
    request<AuthResponse>('/auth/register', data),

  getMe: () =>
    request<{ id: string; email: string }>('/auth/me'),
};
