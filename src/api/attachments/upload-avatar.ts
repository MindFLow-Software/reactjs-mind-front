import { api } from '@/lib/axios'
import type { IUploadAttachmentResponse } from '@/types/attachment/upload-attachment-response'

export async function uploadAvatar(
  file: File,
  patientProfileId?: string,
): Promise<IUploadAttachmentResponse> {
  const formData = new FormData()
  formData.append('file', file)
  if (patientProfileId) formData.append('patientProfileId', patientProfileId)
  formData.append('type', 'AVATAR')

  const { data } = await api.post<IUploadAttachmentResponse>(
    '/attachments',
    formData,
  )
  return data
}
