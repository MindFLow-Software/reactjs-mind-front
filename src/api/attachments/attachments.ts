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
  meta:        AttachmentListMeta
}

export async function uploadAttachment(
  file: File,
  patientId: string,
): Promise<UploadAttachmentResponse> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('patientId', patientId)

  const { data } = await api.post<UploadAttachmentResponse>('/attachments', formData)
  return data
}

export async function uploadAvatar(
  file: File,
  patientId: string,
): Promise<UploadAttachmentResponse> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('patientId', patientId)
  formData.append('type', 'AVATAR')

  const { data } = await api.post<UploadAttachmentResponse>('/attachments', formData)
  return data
}

export async function getPatientAttachments(patientId: string | null): Promise<AttachmentPatientItem[]> {
  const { data } = await api.get<{ attachments: AttachmentPatientItem[] }>(
    `/attachments/patient/${patientId}`,
  )
  return data.attachments ?? []
}

export async function getAllAttachments(
  params: FetchAllAttachmentsParams,
): Promise<GetAllAttachmentsResponse> {
  const { data } = await api.get<GetAllAttachmentsResponse>('/attachments', { params })
  return data
}

export async function deleteAttachment(id: string): Promise<void> {
  await api.delete(`/attachments/${id}`)
}
