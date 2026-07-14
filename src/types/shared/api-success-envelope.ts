export type IApiSuccessEnvelope<T = unknown> = {
  success: true
  statusCode: number
  data: T
  message?: string
}
