export interface IAttachment {
  id: string
  uploadedBy: string
  filename: string
  contentType: string
  sizeInBytes: number
  fileUrl: string
  uploadedAt: string
}

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
export type AttachmentListItem = Pick<
  IAttachment,
  'id' | 'filename' | 'fileUrl' | 'contentType' | 'sizeInBytes' | 'uploadedAt'
> & {
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
