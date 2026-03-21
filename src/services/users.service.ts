import { ApiResponseError, InvalidApiResponseError, apiEndpoints, apiFetch } from '../lib/api'

export type RegisterPayload = {
  name: string
  email: string
  password: string
}

type RegisterResponse = {
  success?: boolean
  message?: string
}

export async function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
  const response = await apiFetch(apiEndpoints.authRegister, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data: unknown = await response.json()

  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'message' in data && typeof data.message === 'string'
        ? data.message
        : 'Register request failed'
    throw new ApiResponseError(response.status, message)
  }

  if (!data || typeof data !== 'object') {
    throw new InvalidApiResponseError()
  }

  return data as RegisterResponse
}
