import { api } from '@/lib/axios'
import type { IAttachmentPatientItem } from '@/types/attachment/attachment-patient-item'

export async function getPatientAttachments(
  patientId: string | null,
): Promise<IAttachmentPatientItem[]> {
  const { data } = await api.get<{ attachments: IAttachmentPatientItem[] }>(
    // ToDo: trocar rota, o correto, de acordo com o REST seria: /patients/${patientId}/attachments
    `/attachments/patient/${patientId}`,
  )
  return data.attachments ?? []
}
