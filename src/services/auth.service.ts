import { ApiResponseError, InvalidApiResponseError, UnauthorizedError, apiEndpoints, apiFetch } from '../lib/api'

export type LoginPayload = {
  email: string
  password: string
}

export type LoginResponse = {
  message: string
  user: {
    id: string
    email: string
    role: string
  }
}

function isLoginResponse(payload: unknown): payload is LoginResponse {
  if (!payload || typeof payload !== 'object') {
    return false
  }

  const candidate = payload as Partial<LoginResponse>

  return Boolean(
    candidate.user &&
      typeof candidate.user === 'object' &&
      typeof candidate.user.id === 'string' &&
      typeof candidate.user.email === 'string' &&
      typeof candidate.user.role === 'string',
  )
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await apiFetch(apiEndpoints.authLogin, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    timeoutMs: 25000,
  })

  if (response.status === 401) {
    throw new UnauthorizedError('Invalid email or password.')
  }

  if (!response.ok) {
    throw new ApiResponseError(response.status)
  }

  const data: unknown = await response.json()

  if (!isLoginResponse(data)) {
    throw new InvalidApiResponseError()
  }

  return data
}
