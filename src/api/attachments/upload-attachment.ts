import { api } from '@/lib/axios'
import type { UploadAttachmentResponse } from '@/types/attachment'

export async function uploadAttachment(
  file: File,
  patientProfileId: string,
): Promise<UploadAttachmentResponse> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('patientProfileId', patientProfileId)

  const { data } = await api.post<UploadAttachmentResponse>(
    '/attachments',
    formData,
  )
  return data
}
