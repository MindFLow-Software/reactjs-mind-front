import { api } from '@/lib/axios'

export interface Popup {
  id: string
  title?: string
  body?: string
  imageUrl?: string
  ctaText?: string
  ctaUrl?: string
  type: 'MODAL' | 'SLIDE_IN' | 'BAR' | 'TOAST'
  styleConfig?: any
}

export async function fetchActivePopups() {
  const response = await api.get<{ popups: Popup[] }>('/popups/active')
  return response.data.popups
}

export async function markPopupAsViewed(popupId: string, action?: string) {
  await api.post(`/popups/${popupId}/view`, { action })
}