// GET /attachments/patient/:patientId
export interface AttachmentPatientItem {
  id: string
  filename: string
  url: string
  type: string
  size: number
  uploadedAt: string
}

// GET /attachments (paginado)
// ⚠️ SizeInBytes com S maiúsculo — bug de nomenclatura no backend
export interface AttachmentListItem {
  id: string
  filename: string
  fileUrl: string
  contentType: string
  SizeInBytes: number
  uploadedAt: string
  patient: { firstName: string; lastName: string } | null
}

export interface AttachmentListMeta {
  pageIndex: number
  totalCount: number
  perPage: number
  totalStorageSize: number
}

// POST /attachments
export interface UploadAttachmentResponse {
  attachmentId: string
  url: string
}

export type FetchAllAttachmentsParams = {
  page?: number
  filter?: string
  patientId?: string
  from?: string
  to?: string
  contentType?: string
}
