import { api } from '@/lib/axios'
import type { IFetchAllAttachmentsParams } from '@/types/attachment/fetch-all-attachments-params'
import type { IGetAllAttachmentsResponse } from '@/types/attachment/get-all-attachments-response'

export async function getAllAttachments(
  params: IFetchAllAttachmentsParams,
): Promise<IGetAllAttachmentsResponse> {
  const { data } = await api.get<IGetAllAttachmentsResponse>('/attachments', {
    params,
  })
  return data
}
