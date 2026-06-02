import { api } from '@/lib/axios'
import type { AddressByCepResponse } from '@/types/patient'

export async function getAddressByCep(cep: string, options?: { signal?: AbortSignal }): Promise<AddressByCepResponse> {
  const { data } = await api.get<AddressByCepResponse>(`/address/${cep}`, {
    signal: options?.signal
  })
  return data
}
