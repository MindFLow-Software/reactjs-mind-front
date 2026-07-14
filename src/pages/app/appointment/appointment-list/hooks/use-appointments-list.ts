import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import {
  getAppointments,
  type GetAppointmentsResponse,
} from '@/api/appointments/get-appointments'
import { queryKeys } from '@/constants/query-keys'
import type { AppointmentStatus } from '@/types/appointment/appointment-status'

export interface UseAppointmentsListParams {
  pageIndex: number
  perPage: number
  status: AppointmentStatus | null
  name?: string
}

export function useAppointmentsList(
  params: UseAppointmentsListParams,
): UseQueryResult<GetAppointmentsResponse, Error> {
  return useQuery<GetAppointmentsResponse, Error>({
    queryKey: queryKeys.appointments({ ...params }),
    queryFn: () => getAppointments(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  })
}
