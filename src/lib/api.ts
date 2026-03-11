const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

export const apiEndpoints = {
  authLogin: `${API_BASE_URL}/auth/v1/login`,
  authRegister: `${API_BASE_URL}/auth/v1/register`,
  users: {
    byId: (id: string) => `${API_BASE_URL}/users/${id}`,
    tasksByUserId: (userId: string) => `${API_BASE_URL}/users/${userId}/tasks`,
    createTask: `${API_BASE_URL}/users/tasks`,
    taskById: (id: string) => `${API_BASE_URL}/users/tasks/${id}`,
    deleteTaskById: (id: string) => `${API_BASE_URL}/users/task/${id}`,
  },
}
