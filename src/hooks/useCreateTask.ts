import { useState } from 'react'
import { getAuthUser } from '../lib/auth'
import { taskRegisterSchema, taskSchema } from '../lib/task.schema'
import type { TaskFormErrors, TaskFormValues } from '../lib/task.schema'
import { createTask } from '../services/tasks.service'

const initialValues: TaskFormValues = {
  title: '',
  description: '',
  status: 'pending',
}

export function useCreateTask() {
  const [values, setValues] = useState<TaskFormValues>(initialValues)
  const [errors, setErrors] = useState<TaskFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'success' | 'error' | null>(null)

  function updateField(field: keyof TaskFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value as TaskFormValues[typeof field] }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  async function submit(): Promise<boolean> {
    const parsed = taskSchema.safeParse(values)
    if (!parsed.success) {
      const nextErrors: TaskFormErrors = {}
      for (const issue of parsed.error.issues) {
        const field = issue.path[0]
        if (typeof field === 'string' && !nextErrors[field as keyof TaskFormValues]) {
          nextErrors[field as keyof TaskFormValues] = issue.message
        }
      }
      setErrors(nextErrors)
      setStatus('error')
      setMessage('Please fix the highlighted fields.')
      return false
    }

    setErrors({})
    setIsSubmitting(true)
    setStatus(null)
    setMessage('')

    try {
      const authUser = getAuthUser()
      if (!authUser?.id) {
        setStatus('error')
        setMessage('User session is invalid. Please login again.')
        return false
      }

      const registerPayload = {
        title: parsed.data.title.trim(),
        description: parsed.data.description.trim(),
        status: parsed.data.status,
        userId: authUser.id,
      }

      const registerParsed = taskRegisterSchema.safeParse(registerPayload)
      if (!registerParsed.success) {
        setStatus('error')
        setMessage('Task payload is invalid.')
        return false
      }

      await createTask({
        ...registerParsed.data,
      })
      setStatus('success')
      setMessage('Task created successfully.')
      setValues(initialValues)
      return true
    } catch {
      setStatus('error')
      setMessage('Failed to create task.')
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  return { values, errors, isSubmitting, message, status, updateField, submit }
}
