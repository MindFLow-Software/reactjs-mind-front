import { api } from '@/lib/axios'
import type { Iuser } from '@/types/user'

export interface SignInBody {
  email: string
  password: string
}

export interface SignInResponse {
  message: string
  accessToken?: string
  token?: string
  // ToDo: change userType to be Iuser
  user: Iuser
}

export async function signIn({ email, password }: SignInBody) {
  const response = await api.post<SignInResponse>('/session', {
    email,
    password
  })

  const data = response.data
  return data
}