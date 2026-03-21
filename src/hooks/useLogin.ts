import { useRef, useState } from 'react'
import { saveAuthSession } from '../lib/auth'
import {
  ApiConnectionError,
  ApiResponseError,
  ApiTimeoutError,
  InvalidApiResponseError,
  UnauthorizedError,
} from '../lib/api'
import { login } from '../services/auth.service'
import { loginSchema } from '../lib/login.schema'
import type { LoginFormErrors, LoginFormValues } from '../lib/login.schema'

type LoginStatus = 'success' | 'error' | 'info' | null

const initialValues: LoginFormValues = {
  email: '',
  password: '',
}

export function useLogin() {
  const [values, setValues] = useState<LoginFormValues>(initialValues)
  const [errors, setErrors] = useState<LoginFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<LoginStatus>(null)
  const [message, setMessage] = useState('')
  const slowRequestTimerRef = useRef<number | null>(null)

  function updateField(field: keyof LoginFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  async function submit() {
    const parsed = loginSchema.safeParse(values)

    if (!parsed.success) {
      const nextErrors: LoginFormErrors = {}

      for (const issue of parsed.error.issues) {
        const field = issue.path[0]
        if (field && typeof field === 'string' && !nextErrors[field as keyof LoginFormValues]) {
          nextErrors[field as keyof LoginFormValues] = issue.message
        }
      }

      setErrors(nextErrors)
      setStatus('error')
      setMessage('Please fix the highlighted fields.')
      return false
    }

    setIsSubmitting(true)
    setErrors({})
    setStatus('info')
    setMessage('Connecting to the server...')

    slowRequestTimerRef.current = window.setTimeout(() => {
      setStatus('info')
      setMessage('The server is starting after inactivity. The first login may take a few more seconds.')
    }, 4000)

    try {
      const data = await login({
        email: parsed.data.email.trim().toLowerCase(),
        password: parsed.data.password,
      })
      saveAuthSession(data.user, {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
      })

      setStatus('success')
      setMessage(data.message || 'Login successfully completed.')
      setValues((current) => ({ ...current, password: '' }))
      return true
    } catch (error) {
      setStatus('error')

      if (error instanceof UnauthorizedError) {
        setMessage('Invalid email or password.')
        return false
      }

      if (error instanceof ApiTimeoutError) {
        setMessage('The server took too long to respond. It may still be starting up. Please try again in a few seconds.')
        return false
      }

      if (error instanceof ApiConnectionError) {
        setMessage('Could not connect to the server. Check your connection and try again.')
        return false
      }

      if (error instanceof InvalidApiResponseError) {
        setMessage('The server returned an unexpected response. Please try again.')
        return false
      }

      if (error instanceof ApiResponseError) {
        if (error.status >= 500) {
          setMessage('The server is unavailable right now or still starting. Please try again in a few seconds.')
          return false
        }

        setMessage(error.message || 'Login could not be completed. Please review your data and try again.')
        return false
      }

      setMessage('Login failed due to an unexpected error. Please try again.')
      return false
    } finally {
      if (slowRequestTimerRef.current) {
        window.clearTimeout(slowRequestTimerRef.current)
        slowRequestTimerRef.current = null
      }

      setIsSubmitting(false)
    }
  }

  return {
    values,
    errors,
    isSubmitting,
    status,
    message,
    updateField,
    submit,
  }
}
