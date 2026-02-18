import { api } from "@/lib/axios"

export interface Attachment {
  id: string
  filename: string
  fileUrl: string
  contentType: string
  SizeInBytes: number
  uploadedAt: string
  patient?: {
    id: string
    firstName: string
    lastName: string
  }
}

interface GetAttachmentsResponse {
  attachments: Attachment[]
  meta: {
    pageIndex: number
    totalCount: number
    perPage: number
    totalStorageSize: number
  }
}

// 🟢 VEJA A MUDANÇA: Agora aceita o patientId
export async function getAllAttachments(
  pageIndex: number, 
  search?: string, 
  patientId?: string
): Promise<GetAttachmentsResponse> {
  const response = await api.get<GetAttachmentsResponse>("/attachments", {
    params: { 
      page: pageIndex,
      filter: search,
      // 🟢 Se for 'all', não enviamos nada. Se tiver ID, enviamos.
      patientId: patientId === 'all' ? undefined : patientId 
    }
  })
  return response.data
}