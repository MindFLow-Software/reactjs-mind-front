import { api } from '@/lib/axios'
import type { IUploadAttachmentResponse } from '@/types/attachment/upload-attachment-response'

export async function uploadAttachment(
  file: File,
  patientProfileId: string,
): Promise<IUploadAttachmentResponse> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('patientProfileId', patientProfileId)

  const { data } = await api.post<IUploadAttachmentResponse>(
    '/attachments',
    formData,
  )
  return data
}
