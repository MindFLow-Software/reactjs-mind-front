import { api } from '@/lib/axios'
import type { IAnamnesisContent } from '@/types/clinical/anamnesis-content'

export async function getAnamnesis(
  patientProfileId: string,
): Promise<IAnamnesisContent> {
  const response = await api.get(
    `/patient-profiles/${patientProfileId}/anamnesis`,
  )
  return response.data.anamnesis
}
