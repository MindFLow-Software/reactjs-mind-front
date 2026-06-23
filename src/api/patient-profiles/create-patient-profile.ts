import { api } from '@/lib/axios'
import type { CreatePatientBody, CreatePatientResponse } from '@/types/patient'

export interface IcreatePatientProfileInput
  extends Omit<CreatePatientBody, 'dateOfBirth'> {
  dateOfBirth?: Date | string | null
}

export async function createPatientProfile(
  data: IcreatePatientProfileInput,
): Promise<CreatePatientResponse> {
  const formattedData: CreatePatientBody = {
    ...data,
    cpf: data.cpf ? data.cpf.replace(/\D/g, '') : undefined,
    phoneNumber: data.phoneNumber?.replace(/\D/g, '') || undefined,
    email: data.email || undefined,
    cep: data.cep?.replace(/\D/g, '') || undefined,
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
