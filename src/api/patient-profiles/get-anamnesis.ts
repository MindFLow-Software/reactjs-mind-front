import { api } from '@/lib/axios'
import type { IAnamnesisContent } from '@/types/clinical'

export async function getAnamnesis(
  patientProfileId: string,
): Promise<IAnamnesisContent> {
  const response = await api.get(`/patients/${patientProfileId}/anamnesis`)
  return response.data.anamnesis
}
