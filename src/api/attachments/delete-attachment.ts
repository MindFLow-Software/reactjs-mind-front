import { api } from '@/lib/axios'

export async function deleteAttachment(
  id: string,
): Promise<{ message: string | null }> {
  const response = await api.delete(`/attachments/${id}`)
  return { message: response.apiMessage ?? null }
}
