import { api } from '@/lib/axios'

export interface SignInBody {
  email: string
  password: string
}

export interface SignInResponse {
  message: string
  accessToken?: string
  token?: string
}

export async function signIn({ email, password }: SignInBody) {
  const response = await api.post<SignInResponse>('/session', {
    email,
    password,
  })

  return response.data
}
