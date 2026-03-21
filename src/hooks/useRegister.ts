import { useState } from 'react'
import { ApiResponseError } from '../lib/api'
import { registerSchema } from '../lib/register.schema'
import type { RegisterFormErrors, RegisterFormValues } from '../lib/register.schema'
import { registerUser } from '../services/users.service'

type RegisterStatus = 'success' | 'error' | null

const initialValues: RegisterFormValues = {
  name: '',
  email: '',
  password: '',
}

export function useRegister() {
  const [values, setValues] = useState<RegisterFormValues>(initialValues)
  const [errors, setErrors] = useState<RegisterFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<RegisterStatus>(null)
  const [message, setMessage] = useState('')

  function updateField(field: keyof RegisterFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  async function submit() {
    const parsed = registerSchema.safeParse(values)

    if (!parsed.success) {
      const nextErrors: RegisterFormErrors = {}

      for (const issue of parsed.error.issues) {
        const field = issue.path[0]
        if (field && typeof field === 'string' && !nextErrors[field as keyof RegisterFormValues]) {
          nextErrors[field as keyof RegisterFormValues] = issue.message
        }
      }

      setErrors(nextErrors)
      setStatus('error')
      setMessage('Please fix the highlighted fields.')
      return
    }

    setIsSubmitting(true)
    setErrors({})
    setStatus(null)
    setMessage('')

    try {
      const response = await registerUser({
        name: parsed.data.name.trim(),
        email: parsed.data.email.trim().toLowerCase(),
        password: parsed.data.password,
      })

      setStatus('success')
      setMessage(response.message || 'Registration successful.')
      setValues(initialValues)
    } catch (error) {
      setStatus('error')

      if (error instanceof ApiResponseError) {
        setMessage(error.message)
      } else {
        setMessage('Registration failed. Please try again.')
      }
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
