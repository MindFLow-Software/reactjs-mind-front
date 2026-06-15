import { api } from '@/lib/axios'
import type { Ipatient, UpdatePatientBody } from '@/types/patient'

export type { UpdatePatientBody } from '@/types/patient'

export interface UpdatePatientData
  extends Omit<UpdatePatientBody, 'dateOfBirth'> {
  id: string
  dateOfBirth?: Date | string
}

export async function updatePatients({
  id,
  ...data
}: UpdatePatientData): Promise<Ipatient> {
  const formattedData: UpdatePatientBody = {
    ...data,
    dateOfBirth:
      data.dateOfBirth instanceof Date
        ? data.dateOfBirth.toISOString()
        : data.dateOfBirth || undefined,
    email: data.email || undefined,
    cpf: data.cpf || undefined,
    phoneNumber: data.phoneNumber?.replace(/\D/g, '') || undefined,
    cep: data.cep?.replace(/\D/g, '') || undefined,
  }

  const payload = Object.fromEntries(
    Object.entries(formattedData).filter(
      ([, value]) => value !== undefined && value !== null,
    ),
  )

  const response = await api.put<Ipatient>(`/patients/${id}`, payload)
  return response.data
}
