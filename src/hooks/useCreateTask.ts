import { useCallback, useEffect, useState } from 'react'
import { clearAuthSession, getAuthUser, shouldRetryUnauthorizedRequest } from '../lib/auth'
import { UnauthorizedError } from '../lib/api'
import { taskRegisterSchema, taskSchema } from '../lib/task.schema'
import type { TaskFormErrors, TaskFormValues } from '../lib/task.schema'
import { getCategoriesByUserId } from '../services/categories.service'
import { createTask } from '../services/tasks.service'
import type { Category } from '../types/category'

function navigate(path: string) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

const initialValues: TaskFormValues = {
  title: '',
  description: '',
  status: 'pending',
  categoryId: '',
}

export function useCreateTask() {
  const [values, setValues] = useState<TaskFormValues>(initialValues)
  const [errors, setErrors] = useState<TaskFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'success' | 'error' | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [categoriesErrorMessage, setCategoriesErrorMessage] = useState('')

  function updateField(field: keyof TaskFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value as TaskFormValues[typeof field] }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const loadCategories = useCallback(async (attempt = 0) => {
    setIsLoadingCategories(true)
    setCategoriesErrorMessage('')

    try {
      const authUser = getAuthUser()
      if (!authUser?.id) {
        throw new Error('Missing auth user id')
      }

      const response = await getCategoriesByUserId(authUser.id)
      setCategories(response.categories)
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        if (await shouldRetryUnauthorizedRequest(attempt)) {
          await loadCategories(attempt + 1)
          return
        }

        clearAuthSession()
        navigate('/')
        return
      }

      setCategoriesErrorMessage(error instanceof Error ? error.message : 'Failed to load categories.')
    } finally {
      setIsLoadingCategories(false)
    }
  }, [])

  useEffect(() => {
    void loadCategories()
  }, [loadCategories])

  async function submit(attempt = 0): Promise<boolean> {
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
        categoryId: parsed.data.categoryId?.trim() || undefined,
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
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        if (await shouldRetryUnauthorizedRequest(attempt)) {
          return submit(attempt + 1)
        }

        clearAuthSession()
        navigate('/')
        setStatus('error')
        setMessage('Your session expired. Please login again.')
        return false
      }

      setStatus('error')
      setMessage('Failed to create task.')
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    values,
    errors,
    isSubmitting,
    message,
    status,
    categories,
    isLoadingCategories,
    categoriesErrorMessage,
    updateField,
    submit,
  }
}
