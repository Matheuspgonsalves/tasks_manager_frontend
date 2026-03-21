import { saveAuthSession } from './auth'
import { supabase } from './supabase'

export async function signInWithGoogle(): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) {
    throw error
  }
}

export async function persistGoogleSession(): Promise<boolean> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error || !session?.user || !session.access_token) {
    return false
  }

  saveAuthSession(
    {
      id: session.user.id,
      email: session.user.email ?? '',
    },
    {
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
    },
  )

  return true
}
