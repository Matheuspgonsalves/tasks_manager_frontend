import { apiEndpoints, apiFetch } from '../lib/api'

export type RegisterPayload = {
  name: string
  email: string
  password: string
}

export async function registerUser(payload: RegisterPayload): Promise<void> {
  const response = await apiFetch(apiEndpoints.authRegister, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Register request failed')
  }
}
