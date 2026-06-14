export type ApiErrorCode =
  | 'RESOURCE_NOT_FOUND'
  | 'NOT_ALLOWED'
  | 'APPOINTMENT_CONFLICT'
  | 'APPOINTMENT_DATE_IN_PAST'
  | 'APPOINTMENT_NOT_IN_PROGRESS'
  | 'APPOINTMENT_NOT_SCHEDULED'
  | 'CRP_ALREADY_EXISTS'
  | 'EMAIL_ALREADY_IN_USE'
  | 'FILE_TOO_LARGE'
  | 'INACTIVE_ACCOUNT'
  | 'INACTIVE_PATIENT'
  | 'INVALID_ATTACHMENT_TYPE'
  | 'INVALID_START_TIME'
  | 'OAUTH_ALREADY_LINKED'
  | 'OAUTH_EMAIL_MISMATCH'
  | 'OAUTH_MISSING_EMAIL'
  | 'OAUTH_PROVIDER_CONFLICT'
  | 'PATIENT_ALREADY_EXISTS'
  | 'UNIQUE_CONSTRAINT_VIOLATION'
  | 'INTERNAL_SERVER_ERROR'
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'UNPROCESSABLE_ENTITY'
  | 'TOO_MANY_REQUESTS'
  | 'HTTP_ERROR'

export interface ApiSuccessEnvelope<T = unknown> {
  success: true
  statusCode: number
  data: T
  message?: string
}

export interface ApiErrorEnvelope {
  success?: false
  statusCode?: number
  error: {
    code: ApiErrorCode
    message: string
  }
}

declare module 'axios' {
  interface AxiosError {
    apiCode?: ApiErrorCode
  }
}
