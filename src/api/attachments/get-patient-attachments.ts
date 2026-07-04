import { api } from '@/lib/axios'
import type { AttachmentPatientItem } from '@/types/attachment'

export async function getPatientAttachments(
  patientId: string | null,
): Promise<AttachmentPatientItem[]> {
  const { data } = await api.get<{ attachments: AttachmentPatientItem[] }>(
    // ToDo: trocar rota, o correto, de acordo com o REST seria: /patients/${patientId}/attachments
    `/attachments/patient/${patientId}`,
  )
  return data.attachments ?? []
}
