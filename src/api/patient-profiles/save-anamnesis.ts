import { api } from '@/lib/axios'
import type { IAnamnesisContent } from '@/types/clinical'

export async function saveAnamnesis(
  patientProfileId: string,
  data: IAnamnesisContent,
): Promise<void> {
  await api.put(`/patients/${patientProfileId}/anamnesis`, data)
}
