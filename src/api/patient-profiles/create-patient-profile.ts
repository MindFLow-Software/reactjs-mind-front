import { api } from '@/lib/axios'
import { Normalizer } from '@/utils/normalizer'
import type { CreatePatientBody, CreatePatientResponse } from '@/types/patient'

export interface IcreatePatientProfileInput extends Omit<
  CreatePatientBody,
  'dateOfBirth'
> {
  dateOfBirth?: Date | string | null
}

export async function createPatientProfile(
  data: IcreatePatientProfileInput,
): Promise<CreatePatientResponse> {
  const formattedData: CreatePatientBody = {
    ...data,
    cpf: Normalizer.digits(data.cpf),
    phoneNumber: Normalizer.digits(data.phoneNumber),
    email: data.email,
    // cep: Normalizer.digits(data.cep),
    dateOfBirth:
      data.dateOfBirth instanceof Date
        ? data.dateOfBirth.toISOString()
        : data.dateOfBirth || undefined,
  }

  const response = await api.post<CreatePatientResponse>(
    '/patient-profiles',
    formattedData,
  )
  return response.data
}
