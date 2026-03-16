export type AuthUser = {
  id: string
  email: string
  role: string
}

const USER_KEY = 'auth_user'
const META_KEY = 'auth_meta'
const AUTH_CHANGE_EVENT = 'authchange'
const RECENT_LOGIN_WINDOW_MS = 5000

type AuthMeta = {
  lastLoginAt: number
}

function getStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const storage = window.localStorage
    const probeKey = '__auth_probe__'
    storage.setItem(probeKey, '1')
    storage.removeItem(probeKey)
    return storage
  } catch {
    try {
      const storage = window.sessionStorage
      const probeKey = '__auth_probe__'
      storage.setItem(probeKey, '1')
      storage.removeItem(probeKey)
      return storage
    } catch {
      return null
    }
  }
}

function readAuthMeta(storage: Storage): AuthMeta | null {
  const rawMeta = storage.getItem(META_KEY)
  if (!rawMeta) {
    return null
  }

  try {
    return JSON.parse(rawMeta) as AuthMeta
  } catch {
    storage.removeItem(META_KEY)
    return null
  }
}

function dispatchAuthChange(): void {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
}

export function saveAuthSession(user: AuthUser): void {
  const storage = getStorage()
  if (!storage) {
    return
  }

  storage.setItem(USER_KEY, JSON.stringify(user))
  storage.setItem(META_KEY, JSON.stringify({ lastLoginAt: Date.now() }))
  dispatchAuthChange()
}

export function isAuthenticated(): boolean {
  return Boolean(getAuthUser())
}

export function getAuthUser(): AuthUser | null {
  const storage = getStorage()
  if (!storage) {
    return null
  }

  const rawUser = storage.getItem(USER_KEY)
  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser) as AuthUser
  } catch {
    storage.removeItem(USER_KEY)
    return null
  }
}

export function clearAuthSession(): void {
  const storage = getStorage()
  if (!storage) {
    return
  }

  storage.removeItem(USER_KEY)
  storage.removeItem(META_KEY)
  dispatchAuthChange()
}

export function wasRecentlyAuthenticated(): boolean {
  const storage = getStorage()
  if (!storage) {
    return false
  }

  const meta = readAuthMeta(storage)
  if (!meta?.lastLoginAt) {
    return false
  }

  return Date.now() - meta.lastLoginAt <= RECENT_LOGIN_WINDOW_MS
}

export function subscribeToAuthChanges(listener: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => undefined
  }

  window.addEventListener(AUTH_CHANGE_EVENT, listener)
  window.addEventListener('storage', listener)

  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, listener)
    window.removeEventListener('storage', listener)
  }
}
