import { useCallback, useEffect, useState } from 'react'
import { clearAuthSession, getAuthUser, shouldRetryUnauthorizedRequest } from '../lib/auth'
import { UnauthorizedError } from '../lib/api'
import { createCategory, deleteCategory, getCategoriesByUserId, updateCategory } from '../services/categories.service'
import type { Category } from '../types/category'

function navigate(path: string) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function sortCategories(categories: Category[]) {
  return [...categories].sort((a, b) => {
    const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0
    return bDate - aDate
  })
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [busyCategoryId, setBusyCategoryId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const loadCategories = useCallback(async (allowRetry = true) => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const authUser = getAuthUser()
      if (!authUser?.id) {
        throw new Error('Missing auth user id')
      }

      const response = await getCategoriesByUserId(authUser.id)
      setCategories(sortCategories(response.categories))
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        if (allowRetry && (await shouldRetryUnauthorizedRequest(0))) {
          await loadCategories(false)
          return
        }

        clearAuthSession()
        navigate('/')
        return
      }

      setErrorMessage(error instanceof Error ? error.message : 'Failed to load categories.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadCategories()
  }, [loadCategories])

  async function handleCreateCategory(name: string, attempt = 0) {
    setIsCreating(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const authUser = getAuthUser()
      if (!authUser?.id) {
        throw new Error('User session is invalid. Please login again.')
      }

      const response = await createCategory({
        name: name.trim(),
        userId: authUser.id,
      })

      setCategories((current) => sortCategories([response.category, ...current]))
      setSuccessMessage(response.message)
      return {
        success: true as const,
        message: response.message,
      }
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        if (await shouldRetryUnauthorizedRequest(attempt)) {
          return handleCreateCategory(name, attempt + 1)
        }

        clearAuthSession()
        navigate('/')
        return {
          success: false as const,
          message: 'Your session expired. Please login again.',
        }
      }

      const message = error instanceof Error ? error.message : 'Failed to create category.'
      setErrorMessage(message)
      return {
        success: false as const,
        message,
      }
    } finally {
      setIsCreating(false)
    }
  }

  async function handleUpdateCategory(categoryId: string, name: string, attempt = 0) {
    setBusyCategoryId(categoryId)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const authUser = getAuthUser()
      if (!authUser?.id) {
        throw new Error('User session is invalid. Please login again.')
      }

      const response = await updateCategory(categoryId, {
        name: name.trim(),
        userId: authUser.id,
      })

      setCategories((current) =>
        sortCategories(
          current.map((category) =>
            category.id === categoryId ? response.category ?? { ...category, name: name.trim() } : category,
          ),
        ),
      )
      setSuccessMessage(response.message)
      return {
        success: true as const,
        message: response.message,
      }
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        if (await shouldRetryUnauthorizedRequest(attempt)) {
          return handleUpdateCategory(categoryId, name, attempt + 1)
        }

        clearAuthSession()
        navigate('/')
        return {
          success: false as const,
          message: 'Your session expired. Please login again.',
        }
      }

      const message = error instanceof Error ? error.message : 'Failed to update category.'
      setErrorMessage(message)
      return {
        success: false as const,
        message,
      }
    } finally {
      setBusyCategoryId(null)
    }
  }

  async function handleDeleteCategory(categoryId: string, attempt = 0) {
    setBusyCategoryId(categoryId)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const response = await deleteCategory(categoryId)
      setCategories((current) => current.filter((category) => category.id !== categoryId))
      setSuccessMessage(response.message)
      return {
        success: true as const,
        message: response.message,
      }
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        if (await shouldRetryUnauthorizedRequest(attempt)) {
          return handleDeleteCategory(categoryId, attempt + 1)
        }

        clearAuthSession()
        navigate('/')
        return {
          success: false as const,
          message: 'Your session expired. Please login again.',
        }
      }

      const message = error instanceof Error ? error.message : 'Failed to remove category.'
      setErrorMessage(message)
      return {
        success: false as const,
        message,
      }
    } finally {
      setBusyCategoryId(null)
    }
  }

  return {
    categories,
    isLoading,
    errorMessage,
    successMessage,
    busyCategoryId,
    isCreating,
    reload: loadCategories,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
  }
}
