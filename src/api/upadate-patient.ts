import { api } from '@/lib/axios'
import { format } from 'date-fns'
import type { UpdatePatientBody } from '@/contracts/types'

export type { UpdatePatientBody } from '@/contracts/types'

export interface UpdatePatientData extends UpdatePatientBody {
  id: string
  dateOfBirth?: Date | string
}

export async function updatePatients({ id, ...data }: UpdatePatientData) {
  const formattedData: UpdatePatientBody = {
    ...data,
    dateOfBirth:
      data.dateOfBirth instanceof Date
        ? format(data.dateOfBirth, 'yyyy-MM-dd')
        : data.dateOfBirth || undefined,
    cpf: data.cpf || undefined,
    phoneNumber: data.phoneNumber || undefined,
  }

  const payload = Object.fromEntries(
    Object.entries(formattedData).filter(([, value]) => value !== undefined && value !== null),
  )

  const response = await api.put(`/patients/${id}`, payload)
  return response.data
}
