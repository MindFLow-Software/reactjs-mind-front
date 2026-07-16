import { api } from '@/lib/axios'
import type { Gender } from '@/types/shared/enums'

export type CreateUserBody = {
  firstName: string
  lastName: string
  email: string
  password: string
  gender: Gender
  phoneNumber?: string
  cpf?: string
  dateOfBirth?: string
}

export async function createUser(body: CreateUserBody): Promise<void> {
  await api.post('/user', body)
}
