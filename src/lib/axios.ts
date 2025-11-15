import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:8080',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

if (import.meta.env.VITE_ENABLE_API_DELAY === 'true') {
  api.interceptors.request.use(async (config) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return config
  })
}