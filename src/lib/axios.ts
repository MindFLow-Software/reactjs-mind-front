import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

const SKIP_REDIRECT_PATHS = ['/sign-in', '/auth/google/success', '/auth/google/complete']

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('user')

      const currentPath = window.location.pathname
      const shouldRedirect = !SKIP_REDIRECT_PATHS.some((p) => currentPath.startsWith(p))
      if (shouldRedirect) {
        window.location.href = '/sign-in'
      }
    }
    return Promise.reject(error)
  }
)