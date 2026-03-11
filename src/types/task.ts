export type TaskStatus = 'pending' | 'done'

export type Task = {
  id: string
  title: string
  description: string
  status: TaskStatus
  dueDate?: string
  createdAt?: string
  userId?: string
}

export type DashboardStats = {
  done: number
  inProgress: number
  completed: number
  total: number
}
