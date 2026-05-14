import { api } from '@/lib/axios'
import type { AttachmentItem } from '@/contracts/types'

export type { AttachmentItem } from '@/contracts/types'

export async function getPatientAttachments(patientId: string): Promise<AttachmentItem[]> {
  const response = await api.get<{ attachments: AttachmentItem[] }>(
    `/attachments/patient/${patientId}`,
  )
  return response.data.attachments
}

export async function deleteAttachment(id: string): Promise<void> {
  await api.delete(`/attachments/${id}`)
}
