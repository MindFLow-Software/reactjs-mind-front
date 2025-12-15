import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})


if (import.meta.env.VITE_ENABLE_API_DELAY === 'true') {
  api.interceptors.request.use(async (config) => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return config
  })
}