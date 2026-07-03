import { api } from '@/lib/axios'

import type {
  AttachmentPatientItem,
  AttachmentListItem,
  AttachmentListMeta,
  UploadAttachmentResponse,
  FetchAllAttachmentsParams,
} from '@/types/attachment'

export type {
  AttachmentPatientItem,
  AttachmentListItem,
  AttachmentListMeta,
  UploadAttachmentResponse,
} from '@/types/attachment'

export type { AttachmentListItem as Attachment } from '@/types/attachment'

export interface GetAllAttachmentsResponse {
  attachments: AttachmentListItem[]
  meta: AttachmentListMeta
}

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

export async function getPatientAttachments(
  patientId: string | null,
): Promise<AttachmentPatientItem[]> {
  const { data } = await api.get<{ attachments: AttachmentPatientItem[] }>(
    // ToDo: trocar rota, o correto, de acordo com o REST seria: /patients/${patientId}/attachments
    `/attachments/patient/${patientId}`,
  )
  return data.attachments ?? []
}

export async function getAllAttachments(
  params: FetchAllAttachmentsParams,
): Promise<GetAllAttachmentsResponse> {
  const { data } = await api.get<GetAllAttachmentsResponse>('/attachments', {
    params,
  })
  return data
}

export async function deleteAttachment(
  id: string,
): Promise<{ message: string | null }> {
  const response = await api.delete(`/attachments/${id}`)
  return { message: response.apiMessage ?? null }
}
