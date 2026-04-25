import type { Task, TaskRequest } from '../types';

const BASE_URL = '/api';

async function get<T>(url: string, params?: object): Promise<T> {
  const token = localStorage.getItem('token');
  let queryString = '';
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v && searchParams.append(k, v));
    queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
  }

  const response = await fetch(`${BASE_URL}${url}${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
  });
  if (!response.ok) throw { response: { data: await response.json() } };
  return response.json();
}

async function post<T>(url: string, data?: object): Promise<T> {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!response.ok) throw { response: { data: await response.json() } };
  return response.json();
}

async function put<T>(url: string, data: object): Promise<T> {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}${url}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw { response: { data: await response.json() } };
  return response.json();
}

async function patch<T>(url: string, data: object): Promise<T> {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}${url}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw { response: { data: await response.json() } };
  return response.json();
}

async function del(url: string): Promise<void> {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}${url}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
  });
  if (!response.ok) throw { response: { data: await response.json() } };
}

export const taskApi = {
  getTasks: (params?: { status?: string; tag?: string; priority?: string }) =>
    get<Task[]>('/tasks', params),

  getTask: (id: string) =>
    get<Task>(`/tasks/${id}`),

  createTask: (data: TaskRequest) =>
    post<Task>('/tasks', data),

  updateTask: (id: string, data: TaskRequest) =>
    put<Task>(`/tasks/${id}`, data),

  updateStatus: (id: string, status: string) =>
    patch<Task>(`/tasks/${id}/status`, { status }),

  updatePriority: (id: string, priority: string) =>
    patch<Task>(`/tasks/${id}/priority`, { priority }),

  updateSubtasks: (id: string, subtasks: { title: string; completed: boolean }[]) =>
    patch<Task>(`/tasks/${id}/subtasks`, { subtasks }),

  deleteTask: (id: string) =>
    del(`/tasks/${id}`),

  decomposeTask: (id: string) =>
    post<Task>(`/tasks/${id}/decompose`),

  getSuggestions: (id: string) =>
    get<{ id: string; title: string; completed: boolean }[]>(`/tasks/${id}/suggestions`),
};

export const templateApi = {
  getTemplates: () =>
    get('/templates'),

  getTemplate: (id: string) =>
    get(`/templates/${id}`),

  createTemplate: (data: any) =>
    post('/templates', data),

  updateTemplate: (id: string, data: any) =>
    put(`/templates/${id}`, data),

  deleteTemplate: (id: string) =>
    del(`/templates/${id}`),

  applyTemplate: (id: string) =>
    post<Task>(`/templates/${id}/apply`),
};

export const relationApi = {
  getRelations: (taskId: string) =>
    get(`/tasks/${taskId}/relations`),

  createRelation: (taskId: string, targetTaskId: string, relationType: string) =>
    post(`/tasks/${taskId}/relations`, { targetTaskId, relationType }),

  deleteRelation: (id: string) =>
    del(`/relations/${id}`),

  getBlocking: (taskId: string) =>
    get(`/tasks/${taskId}/blocking`),

  getBlocked: (taskId: string) =>
    get(`/tasks/${taskId}/blocked`),
};

export const commentApi = {
  getComments: (taskId: string) =>
    get(`/tasks/${taskId}/comments`),

  createComment: (taskId: string, content: string) =>
    post(`/tasks/${taskId}/comments`, { content }),

  deleteComment: (id: string) =>
    del(`/comments/${id}`),
};
