export type IApiErrorEnvelope = {
  success?: false
  statusCode?: number
  message?: string
  error: {
    message: string
  }
}
