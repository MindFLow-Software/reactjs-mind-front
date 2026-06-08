import { AxiosError } from 'axios'

export class Sanitize {
  static responseError(error: unknown): string {
    if (error instanceof AxiosError) {
      return error.message ?? 'Ocorreu um erro inesperado.'
    }
    return (error as Error)?.message ?? 'Ocorreu um erro inesperado.'
  }
}
