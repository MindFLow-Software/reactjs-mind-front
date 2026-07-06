import axios from 'axios'
import { env } from '@/env'
import { useActivePracticeContextStore } from '@/store/use-active-practice-context-store'
import { useSessionStore } from '@/store/use-session-store'
import type {
  // ApiErrorCode,
  ApiSuccessEnvelope,
  ApiErrorEnvelope,
} from '@/types/api'

// const API_ERROR_MESSAGES_PT: Partial<Record<ApiErrorCode, string>> = {
//   PATIENT_ALREADY_EXISTS: 'Já existe um paciente com este CPF.',
// }

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

function isSuccessEnvelope(body: unknown): body is ApiSuccessEnvelope {
  return (
    typeof body === 'object' &&
    body !== null &&
    (body as ApiSuccessEnvelope).success === true &&
    'data' in (body as object)
  )
}

function isErrorEnvelope(body: unknown): body is ApiErrorEnvelope {
  return (
    typeof body === 'object' &&
    body !== null &&
    /*typeof (body as ApiErrorEnvelope).error?.code === 'string' &&*/
    typeof (body as ApiErrorEnvelope).error?.message === 'string'
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
      const envelope = error.response!.data as ApiErrorEnvelope
      error.message = envelope?.message ?? envelope.error.message
      // error.apiCode = envelope.statusCode
    }

    if (error.response.status === 401) {
      useSessionStore.getState().clearSession()
      const currentPath = window.location.pathname
      const shouldRedirect = !SKIP_REDIRECT_PATHS.some((p) =>
        currentPath.startsWith(p),
      )
      if (shouldRedirect) window.location.href = '/sign-in'
    }

    return Promise.reject(error)
  },
)
