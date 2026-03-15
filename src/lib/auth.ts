export type AuthUser = {
  id: string
  email: string
  role: string
}

const USER_KEY = 'auth_user'

export function saveAuthSession(user: AuthUser): void {
  sessionStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function isAuthenticated(): boolean {
  return Boolean(getAuthUser())
}

export function getAuthUser(): AuthUser | null {
  const rawUser = sessionStorage.getItem(USER_KEY)
  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser) as AuthUser
  } catch {
    sessionStorage.removeItem(USER_KEY)
    return null
  }
}

export function clearAuthSession(): void {
  sessionStorage.removeItem(USER_KEY)
}
