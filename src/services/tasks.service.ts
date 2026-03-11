import { getAuthToken } from '../lib/auth'
import { apiEndpoints } from '../lib/api'
import type { Task, TaskStatus } from '../types/task'

type TaskApiShape = {
  id: string
  title?: string
  description?: string
  status?: string
  dueDate?: string
  due_date?: string
  createdAt?: string
  created_at?: string
  userId?: string
  user_id?: string
  user?: {
    id?: string
  }
}

type CreateTaskPayload = {
  title: string
  description: string
  status: TaskStatus
  userId: string
}

type UpdateTaskPayload = CreateTaskPayload

type ApiEnvelope = {
  message?: string
  tasks?: TaskApiShape[] | TaskApiShape
  task?: TaskApiShape
  data?: TaskApiShape[] | TaskApiShape
}

function mapStatus(status: string | undefined): TaskStatus {
  if (!status) return 'pending'
  const normalized = status.toLowerCase()
  if (normalized === 'done' || normalized === 'completed') return 'done'
  if (normalized === 'pending' || normalized === 'in_progress' || normalized === 'inprogress' || normalized === 'active') return 'pending'
  return 'pending'
}

function normalizeTask(task: TaskApiShape): Task {
  return {
    id: task.id,
    title: task.title ?? 'Untitled task',
    description: task.description ?? '',
    status: mapStatus(task.status),
    dueDate: task.dueDate ?? task.due_date,
    createdAt: task.createdAt ?? task.created_at,
    userId: task.userId ?? task.user_id ?? task.user?.id,
  }
}

function extractMany(payload: unknown): TaskApiShape[] {
  if (Array.isArray(payload)) return payload as TaskApiShape[]
  if (!payload || typeof payload !== 'object') return []

  const envelope = payload as ApiEnvelope

  if (Array.isArray(envelope.tasks)) return envelope.tasks
  if (Array.isArray(envelope.data)) return envelope.data

  if (envelope.tasks && typeof envelope.tasks === 'object') return [envelope.tasks]
  if (envelope.task && typeof envelope.task === 'object') return [envelope.task]
  if (envelope.data && typeof envelope.data === 'object' && !Array.isArray(envelope.data)) return [envelope.data]

  return []
}

function extractOne(payload: unknown): TaskApiShape {
  if (!payload || typeof payload !== 'object') return { id: '' }

  const envelope = payload as ApiEnvelope

  if (envelope.task && typeof envelope.task === 'object') return envelope.task
  if (envelope.tasks && typeof envelope.tasks === 'object' && !Array.isArray(envelope.tasks)) return envelope.tasks
  if (envelope.data && typeof envelope.data === 'object' && !Array.isArray(envelope.data)) return envelope.data

  return payload as TaskApiShape
}

function buildHeaders(): HeadersInit {
  const token = getAuthToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function getAllTasks(): Promise<Task[]> {
  const response = await fetch(apiEndpoints.users.createTask, {
    method: 'GET',
    headers: buildHeaders(),
  })

  if (!response.ok) {
    throw new Error('Failed to fetch tasks')
  }

  const payload = await response.json()
  return extractMany(payload).map(normalizeTask).filter((task) => task.id)
}

export async function getTasksByUserId(userId: string): Promise<Task[]> {
  const response = await fetch(apiEndpoints.users.tasksByUserId(userId), {
    method: 'GET',
    headers: buildHeaders(),
  })

  if (response.status === 404) {
    return []
  }

  if (!response.ok) {
    throw new Error('Failed to fetch tasks by user id')
  }

  const payload = await response.json()
  return extractMany(payload).map(normalizeTask).filter((task) => task.id)
}

export async function getTaskById(taskId: string): Promise<Task> {
  const response = await fetch(apiEndpoints.users.taskById(taskId), {
    method: 'GET',
    headers: buildHeaders(),
  })

  if (!response.ok) {
    throw new Error('Failed to fetch task by id')
  }

  const payload = await response.json()
  const data = extractOne(payload)
  return normalizeTask(data)
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const response = await fetch(apiEndpoints.users.createTask, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Failed to create task')
  }

  const rawPayload = await response.json()
  return normalizeTask(extractOne(rawPayload))
}

export async function updateTask(taskId: string, payload: UpdateTaskPayload): Promise<Task> {
  const response = await fetch(apiEndpoints.users.taskById(taskId), {
    method: 'PUT',
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Failed to update task')
  }

  const rawPayload = await response.json()
  return normalizeTask(extractOne(rawPayload))
}

export async function deleteTask(taskId: string): Promise<void> {
  const response = await fetch(apiEndpoints.users.deleteTaskById(taskId), {
    method: 'DELETE',
    headers: buildHeaders(),
  })

  if (!response.ok) {
    throw new Error('Failed to delete task')
  }
}
