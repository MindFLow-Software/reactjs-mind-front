import { api } from '@/lib/axios'
import type { IAnamnesis } from '@/types/clinical/anamnesis'
import type { ISaveAnamnesisBody } from '@/types/clinical/save-anamnesis-body'

export async function saveAnamnesis(
  patientProfileId: string,
  data: ISaveAnamnesisBody,
): Promise<{ anamnesis: IAnamnesis; message: string | null }> {
  const response = await api.put(
    `/patient-profiles/${patientProfileId}/anamnesis`,
    data,
  )
  return {
    anamnesis: response.data.anamnesis,
    message: response.apiMessage ?? null,
  }
}
