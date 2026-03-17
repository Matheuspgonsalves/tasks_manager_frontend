import { useCallback, useEffect, useMemo, useState } from 'react'
import { clearAuthSession, getAuthUser, shouldRetryUnauthorizedRequest } from '../lib/auth'
import { UnauthorizedError } from '../lib/api'
import { getCategoriesByUserId } from '../services/categories.service'
import { deleteTask, getAllTasks, getTasksByCategory, getTasksByStatus, searchTasks, updateTask } from '../services/tasks.service'
import type { Category } from '../types/category'
import type { Task, TaskStatus } from '../types/task'

function navigate(path: string) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function hydrateTaskCategories(tasks: Task[], categories: Category[]) {
  return tasks.map((task) => {
    if (task.categoryName || !task.categoryId) {
      return task
    }

    const category = categories.find((item) => item.id === task.categoryId)
    if (!category) {
      return task
    }

    return {
      ...task,
      categoryName: category.name,
    }
  })
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [busyTaskId, setBusyTaskId] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'done'>('all')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedSearchTerm(searchTerm.trim()), 400)
    return () => window.clearTimeout(timeoutId)
  }, [searchTerm])

  const loadCategories = useCallback(async () => {
    const authUser = getAuthUser()
    if (!authUser?.id) {
      throw new Error('Missing auth user id')
    }

    const categoriesResponse = await getCategoriesByUserId(authUser.id)
    setCategories(categoriesResponse.categories)
    return categoriesResponse.categories
  }, [])

  const loadTasks = useCallback(async (allowRetry = true) => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const authUser = getAuthUser()
      if (!authUser?.id) {
        throw new Error('Missing auth user id')
      }

      const userCategories = categories.length > 0 ? categories : await loadCategories()
      const response = debouncedSearchTerm
        ? await searchTasks(authUser.id, debouncedSearchTerm)
        : categoryFilter
          ? await getTasksByCategory(authUser.id, categoryFilter)
          : statusFilter === 'all'
            ? await getAllTasks(authUser.id)
            : await getTasksByStatus(authUser.id, statusFilter as TaskStatus)
      const hydratedTasks = hydrateTaskCategories(response.tasks, userCategories)
      const sorted = hydratedTasks.sort((a, b) => {
        const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return bDate - aDate
      })

      setTasks(sorted)
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        if (allowRetry && (await shouldRetryUnauthorizedRequest(0))) {
          await loadTasks(false)
          return
        }

        clearAuthSession()
        navigate('/')
        return
      }

      setErrorMessage(error instanceof Error ? error.message : 'Failed to load tasks.')
    } finally {
      setIsLoading(false)
    }
  }, [categories, categoryFilter, debouncedSearchTerm, loadCategories, statusFilter])

  useEffect(() => {
    void loadTasks()
  }, [loadTasks])

  const stats = useMemo(() => {
    const done = tasks.filter((task) => task.status === 'done').length
    const inProgress = tasks.filter((task) => task.status === 'pending').length
    const completed = done

    return {
      done,
      inProgress,
      completed,
      total: tasks.length,
    }
  }, [tasks])

  async function handleDelete(taskId: string, attempt = 0) {
    setBusyTaskId(taskId)
    try {
      await deleteTask(taskId)
      setTasks((current) => current.filter((task) => task.id !== taskId))
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        if (await shouldRetryUnauthorizedRequest(attempt)) {
          await handleDelete(taskId, attempt + 1)
          return
        }

        clearAuthSession()
        navigate('/')
        return
      }

      setErrorMessage('Failed to delete task.')
    } finally {
      setBusyTaskId(null)
    }
  }

  async function handleUpdate(taskId: string, payload: Pick<Task, 'title' | 'description' | 'status' | 'categoryId'>, attempt = 0) {
    setBusyTaskId(taskId)
    try {
      const authUser = getAuthUser()
      if (!authUser?.id) {
        throw new Error('Missing auth user id')
      }

      const updated = await updateTask(taskId, {
        ...payload,
        userId: authUser.id,
      })
      setTasks((current) =>
        current.map((task) => {
          if (task.id !== taskId) {
            return task
          }

          if (updated.categoryName || !updated.categoryId) {
            return updated
          }

          const category = categories.find((item) => item.id === updated.categoryId)
          return {
            ...updated,
            categoryName: category?.name,
          }
        }),
      )
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        if (await shouldRetryUnauthorizedRequest(attempt)) {
          await handleUpdate(taskId, payload, attempt + 1)
          return
        }

        clearAuthSession()
        navigate('/')
        return
      }

      setErrorMessage('Failed to update task.')
    } finally {
      setBusyTaskId(null)
    }
  }

  return {
    tasks,
    stats,
    isLoading,
    errorMessage,
    busyTaskId,
    categories,
    statusFilter,
    categoryFilter,
    searchTerm,
    reload: loadTasks,
    setStatusFilter,
    setCategoryFilter,
    setSearchTerm,
    handleDelete,
    handleUpdate,
  }
}
