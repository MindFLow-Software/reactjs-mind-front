import { AxiosError } from 'axios'

export class Sanitize {
  static responseError(error: unknown): string {
    const errorMessage = error instanceof AxiosError
      ? error.response?.data
      : (error as Error)?.message
      ?? 'Ocorreu um erro inesperado.'

    return errorMessage
  }
}
