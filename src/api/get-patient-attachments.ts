import { api } from '@/lib/axios'
import type { AttachmentPatientItem } from '@/contracts/types'

export type { AttachmentPatientItem } from '@/contracts/types'

export async function getPatientAttachments(patientId: string): Promise<AttachmentPatientItem[]> {
  const response = await api.get<{ attachments: AttachmentPatientItem[] }>(
    `/attachments/patient/${patientId}`,
  )
  return response.data.attachments
}

export async function deleteAttachment(id: string): Promise<void> {
  await api.delete(`/attachments/${id}`)
}
