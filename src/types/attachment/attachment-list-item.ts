import type { IAttachment } from '@/types/attachment/attachment'

export type IAttachmentListItem = Pick<
  IAttachment,
  'id' | 'filename' | 'fileUrl' | 'contentType' | 'sizeInBytes' | 'uploadedAt'
> & {
  patient: { firstName: string; lastName: string } | null
}
