import { api } from '@/lib/axios'

export async function markPopupAsViewed(
  popupId: string,
  action: string,
): Promise<void> {
  await api.post(`/popups/${popupId}/view`, { action })
}
