const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

export async function apiFetch(input: string, init: RequestInit = {}) {
  return fetch(input, {
    credentials: 'include',
    ...init,
  })
}

export const apiEndpoints = {
  authLogin: `${API_BASE_URL}/auth/v1/login`,
  authRegister: `${API_BASE_URL}/auth/v1/register`,
  users: {
    byId: (id: string) => `${API_BASE_URL}/users/${id}`,
    tasksByUserId: (userId: string) => `${API_BASE_URL}/users/${userId}/tasks`,
    createTask: `${API_BASE_URL}/users/tasks`,
    taskById: (id: string) => `${API_BASE_URL}/users/tasks/${id}`,
    deleteTaskById: (id: string) => `${API_BASE_URL}/users/task/${id}`,
  },
}
