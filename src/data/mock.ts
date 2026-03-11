import type { DashboardStats, Task } from '../types/task'

export const dashboardStatsMock: DashboardStats = {
  done: 5,
  inProgress: 3,
  completed: 8,
  total: 12,
}

export const tasksMock: Task[] = [
  {
    id: '1',
    title: 'Finish onboarding flow',
    description: 'Review API contract and finalize onboarding task states.',
    status: 'in_progress',
    dueDate: '2026-03-10',
  },
  {
    id: '2',
    title: 'Prepare dashboard charts',
    description: 'Create first draft of stats widgets for management view.',
    status: 'todo',
    dueDate: '2026-03-12',
  },
  {
    id: '3',
    title: 'Refactor auth service',
    description: 'Split request/response handlers and improve error mapping.',
    status: 'done',
    dueDate: '2026-03-07',
  },
]
