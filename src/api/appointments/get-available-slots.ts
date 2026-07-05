import { api } from '@/lib/axios'

export interface GetAvailableSlotsRequest {
  psychologistPracticeContextId: string
  date: string
}

export interface GetAvailableSlotsResponse {
  slots: string[]
}

// D16: backend slot calculation risks a hanging loop; guard with a client timeout.
const AVAILABLE_SLOTS_TIMEOUT_MS = 8000

export async function getAvailableSlots({
  psychologistPracticeContextId,
  date,
}: GetAvailableSlotsRequest) {
  const response = await api.get<GetAvailableSlotsResponse>(
    '/appointments/available-slots',
    {
      params: {
        psychologistPracticeContextId,
        date,
      },
      timeout: AVAILABLE_SLOTS_TIMEOUT_MS,
    },
  )

  return response.data
}
