import { AxiosError } from 'axios'

export function getApiErrorMessage(error: unknown, fallback: string): string {
  return error instanceof AxiosError ? error.message : fallback
}
