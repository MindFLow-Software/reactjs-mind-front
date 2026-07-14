import axios from 'axios'
import { env } from '@/env'
import { useActivePracticeContextStore } from '@/store/use-active-practice-context-store'
import type { IApiSuccessEnvelope } from '@/types/shared/api-success-envelope'
import type { IApiErrorEnvelope } from '@/types/shared/api-error-envelope'

declare module 'axios' {
  interface AxiosResponse {
    apiMessage?: string | null
  }
}

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
})

const SKIP_REDIRECT_PATHS = [
  '/sign-in',
  '/auth/google/success',
  '/auth/google/complete',
  '/google-oauth-success',
  '/google-oauth-complete',
]

function isSuccessEnvelope(body: unknown): body is IApiSuccessEnvelope {
  return (
    typeof body === 'object' &&
    body !== null &&
    (body as IApiSuccessEnvelope).success === true &&
    'data' in (body as object)
  )
}

function isErrorEnvelope(body: unknown): body is IApiErrorEnvelope {
  return (
    typeof body === 'object' &&
    body !== null &&
    typeof (body as IApiErrorEnvelope).error?.message === 'string'
  )
}

api.interceptors.request.use((config) => {
  const { activePracticeContextId } = useActivePracticeContextStore.getState()
  if (activePracticeContextId) {
    config.headers['x-psychologist-practice-context-id'] =
      activePracticeContextId
  }
  return config
})

api.interceptors.response.use(
  (response) => {
    if (response.status === 204 || response.data == null) return response
    if (isSuccessEnvelope(response.data)) {
      response.apiMessage = response.data.message ?? null
      response.data = response.data.data
    }
    return response
  },
  (error) => {
    if (!error.response) return Promise.reject(error)

    if (axios.isAxiosError(error) && isErrorEnvelope(error.response?.data)) {
      const envelope = error.response!.data as IApiErrorEnvelope
      error.message = envelope?.message ?? envelope.error.message
    }

    if (error.response.status === 401) {
      useActivePracticeContextStore.getState().clearActivePracticeContextId()
      const currentPath = window.location.pathname
      const shouldRedirect = !SKIP_REDIRECT_PATHS.some((p) =>
        currentPath.startsWith(p),
      )
      if (shouldRedirect) window.location.href = '/sign-in'
    }

    return Promise.reject(error)
  },
)
