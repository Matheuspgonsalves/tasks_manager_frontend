const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

export const apiEndpoints = {
  users: `${API_BASE_URL}/users/`,
}
