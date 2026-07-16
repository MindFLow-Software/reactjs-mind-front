import axios, { isAxiosError } from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { env } from '@/env'
import { ensureFreshSession } from '@/lib/ensure-fresh-session'
import { useActivePracticeContextStore } from '@/store/use-active-practice-context-store'
import type { IApiSuccessEnvelope } from '@/types/shared/api-success-envelope'
import type { IApiErrorEnvelope } from '@/types/shared/api-error-envelope'

// Declaration merging is the only way to augment axios' AxiosResponse; `type` cannot merge.
declare module 'axios' {
  interface AxiosResponse {
    apiMessage?: string | null
  }
}

type IRetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean }

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

// Exact-match only: `includes` would wrongly catch `/sessions/*` (work-hours, finish).
const AUTH_ENDPOINTS = ['/session', '/session/refresh', '/sign-out']

let isRedirecting = false

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

function isAuthEndpoint(url: string | undefined): boolean {
  if (!url) return false
  const path = url.split('?')[0]
  return AUTH_ENDPOINTS.includes(path)
}

function handleTerminalSignOut(): void {
  useActivePracticeContextStore.getState().clearActivePracticeContextId()
  if (isRedirecting) return
  const currentPath = window.location.pathname
  const shouldRedirect = !SKIP_REDIRECT_PATHS.some((p) =>
    currentPath.startsWith(p),
  )
  if (shouldRedirect) {
    isRedirecting = true
    window.location.href = '/sign-in'
  }
}

api.interceptors.request.use((config) => {
  const { activePracticeContextId } = useActivePracticeContextStore.getState()
  if (activePracticeContextId) {
    config.headers['x-psychologist-practice-context-id'] =
      activePracticeContextId
  }
  return config
})

// Interceptor para envelopes de sucesso e erro do backend
api.interceptors.response.use(
  (response) => {
    if (response.status === 204 || response.data == null) return response
    if (isSuccessEnvelope(response.data)) {
      response.apiMessage = response.data.message ?? null
      response.data = response.data.data
    }
    return response
  },
  async (error) => {
    if (!isAxiosError(error)) return Promise.reject(error)
    if (!error.response) return Promise.reject(error)

    if (axios.isAxiosError(error) && isErrorEnvelope(error.response?.data)) {
      const envelope = error.response!.data as IApiErrorEnvelope
      error.message = envelope?.message ?? envelope.error.message
    }

    return Promise.reject(error)
  },
)

// Interceptor para atualizar access_token através de refresh token
// quando recebe erro 401 do backend
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if ((error as AxiosError)?.response?.status !== 401) {
      return Promise.reject(error)
    }

    const config = error.config as IRetryableConfig | undefined

    if (!config || isAuthEndpoint(config.url) || config._retry) {
      handleTerminalSignOut()
      return Promise.reject(error)
    }

    config._retry = true

    try {
      await ensureFreshSession()
      return await api(config)
    } catch {
      handleTerminalSignOut()
      return Promise.reject(error)
    }
  },
)
