import { api } from '@/lib/axios'
import type { IAnamnesis } from '@/types/clinical/anamnesis'

export async function getAnamnesis(
  patientProfileId: string,
): Promise<IAnamnesis | null> {
  const response = await api.get(
    `/patient-profiles/${patientProfileId}/anamnesis`,
  )
  return response.data.anamnesis ?? null
}
