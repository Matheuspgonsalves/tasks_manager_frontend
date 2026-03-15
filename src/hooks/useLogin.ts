import { useState } from 'react'
import { saveAuthSession } from '../lib/auth'
import { login } from '../services/auth.service'
import { loginSchema } from '../lib/login.schema'
import type { LoginFormErrors, LoginFormValues } from '../lib/login.schema'

type LoginStatus = 'success' | 'error' | null

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
    setStatus(null)
    setMessage('')

    try {
      const data = await login({
        email: parsed.data.email.trim().toLowerCase(),
        password: parsed.data.password,
      })
      saveAuthSession(data.user)

      setStatus('success')
      setMessage(data.message || 'Login successfully completed.')
      setValues((current) => ({ ...current, password: '' }))
      return true
    } catch {
      setStatus('error')
      setMessage('Login failed. Please check your credentials.')
      return false
    } finally {
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
