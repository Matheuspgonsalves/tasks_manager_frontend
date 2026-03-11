export type AuthUser = {
  id: string
  email: string
  role: string
}

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export function saveAuthSession(token: string, user: AuthUser): void {
  sessionStorage.setItem(TOKEN_KEY, token)
  sessionStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function isAuthenticated(): boolean {
  return Boolean(sessionStorage.getItem(TOKEN_KEY))
}

export function getAuthToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function getAuthUser(): AuthUser | null {
  const rawUser = sessionStorage.getItem(USER_KEY)
  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser) as AuthUser
  } catch {
    return null
  }
}
