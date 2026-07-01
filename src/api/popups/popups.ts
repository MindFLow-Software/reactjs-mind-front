import { api } from '@/lib/axios'
import type { IPopup } from '@/types/popup'

export async function fetchUnseenPopups() {
  const response = await api.get<{ popups: IPopup[] }>('/popups/unseen')
  return response.data.popups
}

export async function markPopupAsViewed(popupId: string, action: string) {
  await api.post(`/popups/${popupId}/view`, { action })
}
