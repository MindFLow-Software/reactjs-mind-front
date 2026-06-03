import { api } from '@/lib/axios'

// ToDo: fonte única da verdade, deve haver um único tipo Iattachment
// não ter multiplas tipagens para a mesma entidade
import type {
  AttachmentPatientItem,
  AttachmentListItem,
  AttachmentListMeta,
  UploadAttachmentResponse,
  FetchAllAttachmentsParams,
} from '@/types/attachment'

// ToDo: fonte única da verdade, deve haver um único tipo Iattachment
// não ter multiplas tipagens para a mesma entidade
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
    // ToDo: trocar rota, o correto, de acordo com o REST seria: /patients/${patientId}/attachments
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
