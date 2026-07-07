import { api } from '@/lib/axios'
import type { IPopup } from '@/types/popup'

export async function fetchUnseenPopups(): Promise<IPopup[]> {
  const response = await api.get<{ popups: IPopup[] }>('/popups/unseen')
  return response.data.popups
}
