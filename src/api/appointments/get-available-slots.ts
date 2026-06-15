import { api } from '@/lib/axios'

interface GetAvailableSlotsRequest {
  psychologistPracticeContextId: string
  startDate: string
  endDate: string
}

interface GetAvailableSlotsResponse {
  slots: string[]
}

export async function getAvailableSlots({
  psychologistPracticeContextId,
  startDate,
  endDate,
}: GetAvailableSlotsRequest) {
  const response = await api.get<GetAvailableSlotsResponse>(
    '/appointments/available-slots',
    {
      params: {
        psychologistPracticeContextId,
        startDate,
        endDate,
      },
    },
  )

  return response.data
}
