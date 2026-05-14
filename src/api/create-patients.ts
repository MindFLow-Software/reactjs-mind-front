import { api } from '@/lib/axios'
import type { CreatePatientBody, CreatePatientResponse } from '@/contracts/types'

export type { CreatePatientBody, CreatePatientResponse } from '@/contracts/types'

export interface CreatePatientsInput extends CreatePatientBody {
  dateOfBirth?: Date | string | null
}

export async function createPatients(data: CreatePatientsInput): Promise<CreatePatientResponse> {
  const formattedData: CreatePatientBody = {
    ...data,
    cpf: data.cpf ? data.cpf.replace(/\D/g, '') : undefined,
    phoneNumber: data.phoneNumber || undefined,
    dateOfBirth:
      data.dateOfBirth instanceof Date
        ? data.dateOfBirth.toISOString()
        : data.dateOfBirth || undefined,
  }

  const response = await api.post<CreatePatientResponse>('/patient', formattedData)
  return response.data
}
