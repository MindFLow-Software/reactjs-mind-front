import { api } from '@/lib/axios'
import type { Ipatient } from '@/types/patient'

export interface GetPatientByIdResponse {
  patient: Ipatient | null
}

type RawPatientAddress = Omit<
  Ipatient,
  'zipCode' | 'street' | 'neighborhood' | 'city' | 'state'
> & {
  cep: string | null
  logradouro: string | null
  bairro: string | null
  cidade: string | null
  uf: string | null
}

interface RawGetPatientByIdResponse {
  patient: RawPatientAddress | null
}

export async function getPatientById(
  patientId: string,
): Promise<GetPatientByIdResponse> {
  const response = await api.get<RawGetPatientByIdResponse>(
    `/patients/${patientId}`,
  )
  const raw = response.data.patient

  if (!raw) return { patient: null }

  const { cep, logradouro, bairro, cidade, uf, ...rest } = raw

  return {
    patient: {
      ...rest,
      zipCode: cep,
      street: logradouro,
      neighborhood: bairro,
      city: cidade,
      state: uf,
    },
  }
}
