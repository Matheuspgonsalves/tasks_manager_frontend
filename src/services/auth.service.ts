import { apiEndpoints } from '../lib/api'

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
  newAccesToken: string
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await fetch(apiEndpoints.authLogin, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Login request failed')
  }

  return response.json() as Promise<LoginResponse>
}
