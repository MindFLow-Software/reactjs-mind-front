import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { isToday } from 'date-fns'
import { fetchAppointments } from '@/api/appointments/fetch-appointments'
import type { Appointment } from '@/types/appointment'
import { QUERY_STALE_TIME, QUERY_GC_TIME } from '../constants'

export interface UseTodayAppointmentsReturn {
  appointments: Appointment[]
  count: number
  isLoading: boolean
  isError: boolean
}

export function useTodayAppointments(): UseTodayAppointmentsReturn {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard', 'today-appointments'],
    queryFn: () => fetchAppointments({ perPage: 200, orderBy: 'asc' }),
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
  })

  const appointments = useMemo<Appointment[]>(() => {
    if (!data?.appointments) return []
    return data.appointments
      .filter((a) => isToday(new Date(a.scheduledAt)))
      .sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
      ) as Appointment[]
  }, [data])

  return {
    appointments,
    count: appointments.length,
    isLoading,
    isError,
  }
}
