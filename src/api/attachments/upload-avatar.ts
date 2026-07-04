import { api } from '@/lib/axios'
import type { UploadAttachmentResponse } from '@/types/attachment'

export async function uploadAvatar(
  file: File,
  patientProfileId?: string,
): Promise<UploadAttachmentResponse> {
  const formData = new FormData()
  formData.append('file', file)
  if (patientProfileId) formData.append('patientProfileId', patientProfileId)
  formData.append('type', 'AVATAR')

  const { data } = await api.post<UploadAttachmentResponse>(
    '/attachments',
    formData,
  )
  return data
}
