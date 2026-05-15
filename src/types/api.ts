export type ApiErrorCode =
  | 'RESOURCE_NOT_FOUND'
  | 'INVALID_CREDENTIALS'
  | 'UNAUTHORIZED'
  | 'EMAIL_ALREADY_IN_USE'
  | 'PSYCHOLOGIST_NOT_FOUND'
  | 'PATIENT_NOT_FOUND'
  | 'APPOINTMENT_NOT_FOUND'
  | 'SLOT_ALREADY_BOOKED'
  | 'SLOT_NOT_AVAILABLE'
  | 'INVALID_APPOINTMENT_TIME'
  | 'APPOINTMENT_ALREADY_CANCELLED'
  | 'APPOINTMENT_ALREADY_CONFIRMED'
  | 'MISSING_GOOGLE_TOKENS'
  | 'INVALID_GOOGLE_TOKENS'
  | 'GOOGLE_CALENDAR_ERROR'
  | 'VALIDATION_ERROR'
  | 'INTERNAL_ERROR'

export interface ApiSuccessEnvelope<T = unknown> {
  success: true
  statusCode: number
  data: T
  message?: string
}

export interface ApiErrorEnvelope {
  success: false
  statusCode: number
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
