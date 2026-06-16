import { api } from '@/lib/axios'
import type { Ipatient } from '@/types/patient'

export interface GetPatientByIdResponse {
  patient: Ipatient | null
}

type RawPatient = Omit<Ipatient, 'zipCode'> & {
  zip_code: string | null
}

interface RawGetPatientByIdResponse {
  patient: RawPatient | null
}

export async function getPatientById(
  patientId: string,
): Promise<GetPatientByIdResponse> {
  const response = await api.get<RawGetPatientByIdResponse>(
    `/patients/${patientId}`,
  )
  const raw = response.data.patient

  if (!raw) return { patient: null }

  const { zip_code, ...rest } = raw

  return {
    patient: {
      ...rest,
      zipCode: zip_code,
    },
  }
}
