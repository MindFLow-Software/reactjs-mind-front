import { api } from '@/lib/axios'
import type { IUpdatePatientBody } from '@/types/patient/update-patient-body'
import type { IPatientProfile } from '@/types/patient-profile/patient-profile'
import type { IMutationResult } from '@/types/shared/mutation-result'

export type UpdatePatientData = {
  id: string
  dateOfBirth?: Date | string
} & Omit<IUpdatePatientBody, 'dateOfBirth'>

export async function updatePatientProfileById({
  id,
  ...data
}: UpdatePatientData): Promise<IMutationResult<IPatientProfile>> {
  const formattedData: IUpdatePatientBody = {
    ...data,
    dateOfBirth:
      data.dateOfBirth instanceof Date
        ? data.dateOfBirth.toISOString()
        : data.dateOfBirth || undefined,
    email: data.email || undefined,
    cpf: data.cpf || undefined,
    phoneNumber: data.phoneNumber?.replace(/\D/g, '') || undefined,
    zipCode: data.zipCode?.replace(/\D/g, '') || undefined,
  }

  const payload = Object.fromEntries(
    Object.entries(formattedData).filter(
      ([, value]) => value !== undefined && value !== null,
    ),
  )

  const response = await api.put<IPatientProfile>(
    `/patient-profiles/${id}`,
    payload,
  )
  return { data: response.data, message: response.apiMessage ?? null }
}
