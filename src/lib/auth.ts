type AuthUser = {
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
