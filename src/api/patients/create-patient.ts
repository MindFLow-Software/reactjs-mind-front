import { api } from '@/lib/axios'
import type { CreatePatientBody, CreatePatientResponse } from '@/types/patient'

export type { CreatePatientBody, CreatePatientResponse } from '@/types/patient'

export interface CreatePatientsInput
  extends Omit<CreatePatientBody, 'dateOfBirth'> {
  dateOfBirth?: Date | string | null
}

export async function createPatients(
  data: CreatePatientsInput,
): Promise<CreatePatientResponse> {
  const formattedData: CreatePatientBody = {
    ...data,
    cpf: data.cpf ? data.cpf.replace(/\D/g, '') : undefined,
    phoneNumber: data.phoneNumber?.replace(/\D/g, '') || undefined,
    email: data.email || undefined,
    zipCode: data.zipCode?.replace(/\D/g, '') || undefined,
    dateOfBirth:
      data.dateOfBirth instanceof Date
        ? data.dateOfBirth.toISOString()
        : data.dateOfBirth || undefined,
  }

  const response = await api.post<CreatePatientResponse>(
    '/patient',
    formattedData,
  )
  return response.data
}
