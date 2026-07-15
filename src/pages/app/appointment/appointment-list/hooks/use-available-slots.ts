import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import {
  getAvailableSlots,
  type GetAvailableSlotsResponse,
} from '@/api/appointments/get-available-slots'

export type IUseAvailableSlotsParams = {
  psychologistPracticeContextId: string | null
  date: string | null
}

export function useAvailableSlots({
  psychologistPracticeContextId,
  date,
}: IUseAvailableSlotsParams): UseQueryResult<GetAvailableSlotsResponse, Error> {
  return useQuery<GetAvailableSlotsResponse, Error>({
    queryKey: [
      'appointments',
      'available-slots',
      psychologistPracticeContextId,
      date,
    ],
    queryFn: () =>
      getAvailableSlots({
        psychologistPracticeContextId: psychologistPracticeContextId as string,
        date: date as string,
      }),
    enabled: Boolean(psychologistPracticeContextId && date),
  })
}
