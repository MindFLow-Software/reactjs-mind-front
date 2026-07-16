import { api } from '@/lib/axios'
import { Normalizer } from '@/utils/normalizer'
import type { ICreatePatientBody } from '@/types/patient/create-patient-body'
import type { ICreatePatientResponse } from '@/types/patient/create-patient-response'

export type IcreatePatientProfileInput = {
  dateOfBirth?: Date | string | null
} & Omit<ICreatePatientBody, 'dateOfBirth'>

export async function createPatientProfile(
  data: IcreatePatientProfileInput,
): Promise<ICreatePatientResponse> {
  const formattedData: ICreatePatientBody = {
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

  const response = await api.post<ICreatePatientResponse>(
    '/patient-profiles',
    formattedData,
  )
  return response.data
}
