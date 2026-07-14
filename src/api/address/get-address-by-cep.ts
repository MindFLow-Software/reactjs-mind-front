import { api } from '@/lib/axios'
import type { IAddressByCepResponse } from '@/types/patient/address-by-cep-response'

export async function getAddressByCep(
  cep: string,
  options?: { signal?: AbortSignal },
): Promise<IAddressByCepResponse> {
  const { data } = await api.get<IAddressByCepResponse>(`/address/${cep}`, {
    signal: options?.signal,
  })
  return data
}
