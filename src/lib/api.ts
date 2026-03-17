const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

export class ApiTimeoutError extends Error {
  constructor(message = 'The request timed out.') {
    super(message)
    this.name = 'ApiTimeoutError'
  }
}

export class ApiConnectionError extends Error {
  constructor(message = 'Unable to connect to the server.') {
    super(message)
    this.name = 'ApiConnectionError'
  }
}

export class ApiResponseError extends Error {
  status: number

  constructor(status: number, message = 'The server returned an unexpected response.') {
    super(message)
    this.name = 'ApiResponseError'
    this.status = status
  }
}

export class InvalidApiResponseError extends Error {
  constructor(message = 'The server returned an invalid response.') {
    super(message)
    this.name = 'InvalidApiResponseError'
  }
}

type ApiFetchOptions = RequestInit & {
  timeoutMs?: number
}

export async function apiFetch(input: string, init: ApiFetchOptions = {}) {
  const { timeoutMs = 15000, signal, ...requestInit } = init
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs)

  const abortHandler = () => controller.abort()
  signal?.addEventListener('abort', abortHandler)

  try {
    return await fetch(input, {
      ...requestInit,
      credentials: 'include',
      signal: controller.signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiTimeoutError()
    }

    throw new ApiConnectionError()
  } finally {
    window.clearTimeout(timeoutId)
    signal?.removeEventListener('abort', abortHandler)
  }
}

export const apiEndpoints = {
  authLogin: `${API_BASE_URL}/auth/v1/login`,
  authLogout: `${API_BASE_URL}/auth/v1/logout`,
  authRegister: `${API_BASE_URL}/auth/v1/register`,
  users: {
    byId: (id: string) => `${API_BASE_URL}/users/${id}`,
    tasksByUserId: (userId: string) => `${API_BASE_URL}/users/${userId}/tasks`,
    tasksByStatus: (userId: string, status: string) => `${API_BASE_URL}/users/${userId}/tasks/status?status=${encodeURIComponent(status)}`,
    tasksByCategory: (userId: string, categoryId: string) =>
      `${API_BASE_URL}/users/${userId}/tasks/category?categoryId=${encodeURIComponent(categoryId)}`,
    searchTasks: (userId: string, search: string) => `${API_BASE_URL}/users/${userId}/tasks/search?search=${encodeURIComponent(search)}`,
    categoriesByUserId: (userId: string) => `${API_BASE_URL}/users/${userId}/categories`,
    createTask: `${API_BASE_URL}/users/tasks`,
    createCategory: `${API_BASE_URL}/users/categories`,
    taskById: (id: string) => `${API_BASE_URL}/users/tasks/${id}`,
    categoryById: (id: string) => `${API_BASE_URL}/users/categories/${id}`,
    deleteTaskById: (id: string) => `${API_BASE_URL}/users/task/${id}`,
  },
}
