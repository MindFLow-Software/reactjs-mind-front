import { api } from '@/lib/axios'

// GET /attachments/:id is a raw stream (DEC-04 envelope exception) — no {data} unwrap.
export async function getAttachmentBlob(id: string): Promise<Blob> {
  const response = await api.get(`/attachments/${id}`, {
    responseType: 'blob',
  })
  return response.data
}
