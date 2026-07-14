import { api } from '@/lib/axios'
import type { ISessionRawResponse } from '@/types/shared/session-raw-response'

export interface SignInBody {
  email: string
  password: string
}

export async function signIn({
  email,
  password,
}: SignInBody): Promise<ISessionRawResponse> {
  const response = await api.post<ISessionRawResponse>('/session', {
    email,
    password,
  })

  return response.data
}
