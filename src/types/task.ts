export type TaskStatus = 'pending' | 'done'

export type Task = {
  id: string
  title: string
  description: string
  status: TaskStatus
  categoryId?: string
  categoryName?: string
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
