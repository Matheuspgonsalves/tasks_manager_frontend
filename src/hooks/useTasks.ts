import { useCallback, useEffect, useMemo, useState } from 'react'
import { clearAuthSession, getAuthUser } from '../lib/auth'
import { UnauthorizedError } from '../lib/api'
import { deleteTask, getTasksByUserId, updateTask } from '../services/tasks.service'
import type { Task } from '../types/task'

function navigate(path: string) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [busyTaskId, setBusyTaskId] = useState<string | null>(null)

  const loadTasks = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const authUser = getAuthUser()
      if (!authUser?.id) {
        throw new Error('Missing auth user id')
      }

      const userTasks = await getTasksByUserId(authUser.id)
      const sorted = userTasks.sort((a, b) => {
        const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return bDate - aDate
      })

      setTasks(sorted)
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        clearAuthSession()
        navigate('/')
        return
      }

      setErrorMessage('Failed to load tasks.')
    } finally {
      setIsLoading(false)
    }
  }, [])

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

  async function handleDelete(taskId: string) {
    setBusyTaskId(taskId)
    try {
      await deleteTask(taskId)
      setTasks((current) => current.filter((task) => task.id !== taskId))
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        clearAuthSession()
        navigate('/')
        return
      }

      setErrorMessage('Failed to delete task.')
    } finally {
      setBusyTaskId(null)
    }
  }

  async function handleUpdate(taskId: string, payload: Pick<Task, 'title' | 'description' | 'status'>) {
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
      setTasks((current) => current.map((task) => (task.id === taskId ? updated : task)))
    } catch (error) {
      if (error instanceof UnauthorizedError) {
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
    reload: loadTasks,
    handleDelete,
    handleUpdate,
  }
}
