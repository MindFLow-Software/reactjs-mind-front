import { AxiosError } from 'axios'

interface IErrorEnvelope {
  error?: {
    message: string
  }
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) return error.message

  return (error as IErrorEnvelope)?.error?.message ?? fallback
}
