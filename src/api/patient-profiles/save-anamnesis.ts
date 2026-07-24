import { api } from '@/lib/axios'
import type { IAnamnesisContent } from '@/types/clinical/anamnesis-content'

export async function saveAnamnesis(
  patientProfileId: string,
  data: IAnamnesisContent,
): Promise<{ message: string | null }> {
  const response = await api.put(
    `/patient-profiles/${patientProfileId}/anamnesis`,
    data,
  )
  return { message: response.apiMessage ?? null }
}
