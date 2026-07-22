import { Time } from '@/utils/time'
import { Normalizer } from '@/utils/normalizer'
import type { ICreateUserBody } from '@/api/auth/create-user'
import type { ICreateUserData } from '@/validators/user/form/create-user-schema'

export function buildCreateUserBody(data: ICreateUserData): ICreateUserBody {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
    gender: data.gender,
    phoneNumber: Normalizer.digits(data.phoneNumber),
    cpf: Normalizer.digits(data.cpf),
    dateOfBirth: Time.toAmericanFormat(data.dateOfBirth),
  }
}
