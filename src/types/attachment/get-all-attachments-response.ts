import type { IAttachmentListItem } from '@/types/attachment/attachment-list-item'
import type { IAttachmentListMeta } from '@/types/attachment/attachment-list-meta'

export type IGetAllAttachmentsResponse = {
  attachments: IAttachmentListItem[]
  meta: IAttachmentListMeta
}
