import { api } from '@/lib/axios'
import type {
  FetchAllAttachmentsParams,
  GetAllAttachmentsResponse,
} from '@/types/attachment'

export async function getAllAttachments(
  params: FetchAllAttachmentsParams,
): Promise<GetAllAttachmentsResponse> {
  const { data } = await api.get<GetAllAttachmentsResponse>('/attachments', {
    params,
  })
  return data
}
