import { api } from '@/lib/axios'

export type GetAvailableSlotsRequest = {
  psychologistPracticeContextId: string
  date: string
}

export type GetAvailableSlotsResponse = {
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
