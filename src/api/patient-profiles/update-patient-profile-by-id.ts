import { api } from '@/lib/axios'
import type { UpdatePatientBody } from '@/types/patient'
import type { IpatientProfile } from '@/types/patient-profile'

export type { UpdatePatientBody } from '@/types/patient'

export interface UpdatePatientData
  extends Omit<UpdatePatientBody, 'dateOfBirth'> {
  id: string
  dateOfBirth?: Date | string
}

export async function updatePatientProfileById({
  id,
  ...data
}: UpdatePatientData): Promise<IpatientProfile> {
  const formattedData: UpdatePatientBody = {
    ...data,
    dateOfBirth:
      data.dateOfBirth instanceof Date
        ? data.dateOfBirth.toISOString()
        : data.dateOfBirth || undefined,
    cpf: data.cpf || undefined,
    phoneNumber: data.phoneNumber?.replace(/\D/g, '') || undefined,
    cep: data.cep?.replace(/\D/g, '') || undefined,
  }

  const payload = Object.fromEntries(
    Object.entries(formattedData).filter(
      ([, value]) => value !== undefined && value !== null,
    ),
  )

  const response = await api.put<IpatientProfile>(
    `/patient-profiles/${id}`,
    payload,
  )
  return response.data
}
