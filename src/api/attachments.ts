import { api } from '@/lib/axios'
import type {
  AttachmentPatientItem,
  AttachmentListItem,
  AttachmentListMeta,
  UploadAttachmentResponse,
  FetchAllAttachmentsParams,
} from '@/contracts/types'

export type {
  AttachmentPatientItem,
  AttachmentListItem,
  AttachmentListMeta,
  UploadAttachmentResponse,
} from '@/contracts/types'

// Alias para compatibilidade com componentes existentes
export type { AttachmentListItem as Attachment } from '@/contracts/types'

// Tipo normalizado para uso interno no frontend
// Unifica os dois formatos distintos que o backend retorna
export interface NormalizedAttachment {
  id:          string
  filename:    string
  storageKey:  string
  mimeType:    string
  sizeInBytes: number
  uploadedAt:  string
  patient?:    { firstName: string; lastName: string } | null
}

// ---------------------------------------------------------------------------
// Upload
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// GET /attachments/patient/:patientId
// Response shape: { url, type, size } — diferente do endpoint paginado
// ---------------------------------------------------------------------------

export async function getPatientAttachments(patientId: string): Promise<AttachmentPatientItem[]> {
  const { data } = await api.get<{ attachments: AttachmentPatientItem[] }>(
    `/attachments/patient/${patientId}`,
  )
  return data.attachments
}

// ---------------------------------------------------------------------------
// GET /attachments — listagem paginada do psicólogo
// Response shape: { fileUrl, contentType, SizeInBytes } — diferente do endpoint acima
// ---------------------------------------------------------------------------

export interface GetAllAttachmentsResponse {
  attachments: AttachmentListItem[]
  meta:        AttachmentListMeta
}

export async function getAllAttachments(
  params: FetchAllAttachmentsParams,
): Promise<GetAllAttachmentsResponse> {
  const { data } = await api.get<GetAllAttachmentsResponse>('/attachments', { params })
  return data
}

// ---------------------------------------------------------------------------
// DELETE /attachments/:id
// ---------------------------------------------------------------------------

export async function deleteAttachment(id: string): Promise<void> {
  await api.delete(`/attachments/${id}`)
}
