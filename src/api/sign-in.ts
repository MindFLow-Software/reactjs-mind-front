import { api } from '@/lib/axios'

export interface SignInBody {
  email: string
  password: string
}

export interface SignInResponse {
  message: string
  accessToken?: string
  token?: string
  user: {
    id: string
    email: string
    role?: string
  }
}

export async function signIn({ email, password }: SignInBody) {
  const response = await api.post<SignInResponse>('/session', {
    email,
    password
  })

  const data = response.data
  const token = data.accessToken ?? data.token
  if (token) {
    localStorage.setItem('token', token)
  }

  return data
}