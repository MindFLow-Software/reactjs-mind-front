import { api } from '@/lib/axios'
import type { Gender } from '@/types/shared/enums'
import type { IMutationResult } from '@/types/shared/mutation-result'

export type ICreateUserBody = {
  firstName: string
  lastName: string
  email: string
  password: string
  gender: Gender
  phoneNumber?: string
  cpf?: string
  dateOfBirth?: string
}

export async function createUser(
  body: ICreateUserBody,
): Promise<IMutationResult<void>> {
  const response = await api.post('/user', body)
  return { data: undefined, message: response.apiMessage ?? null }
}
