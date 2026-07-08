import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { isToday, isTomorrow, isValid } from 'date-fns'
import { fetchAppointments } from '@/api/appointments/fetch-appointments'
import type { IAppointmentWithNames } from '@/types/appointment'
import { QUERY_STALE_TIME, QUERY_GC_TIME } from '../constants'

export interface UseTodayAppointmentsReturn {
  appointments: IAppointmentWithNames[]
  tomorrowAppointments: IAppointmentWithNames[]
  count: number
  isLoading: boolean
  isError: boolean
}

function byScheduledAtAsc(
  a: IAppointmentWithNames,
  b: IAppointmentWithNames,
): number {
  const dateA = new Date(a.scheduledAt)
  const dateB = new Date(b.scheduledAt)
  if (!isValid(dateA) || !isValid(dateB)) return 0
  return dateA.getTime() - dateB.getTime()
}

export function useTodayAppointments(): UseTodayAppointmentsReturn {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard', 'today-appointments'],
    queryFn: () => fetchAppointments({ perPage: 200, orderBy: 'asc' }),
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
  })

  const appointments = useMemo<IAppointmentWithNames[]>(() => {
    if (!data?.appointments) return []
    return (data.appointments as IAppointmentWithNames[])
      .filter((a) => {
        const date = new Date(a.scheduledAt)
        return isValid(date) && isToday(date)
      })
      .sort(byScheduledAtAsc)
  }, [data])

  const tomorrowAppointments = useMemo<IAppointmentWithNames[]>(() => {
    if (!data?.appointments) return []
    return (data.appointments as IAppointmentWithNames[])
      .filter((a) => {
        const date = new Date(a.scheduledAt)
        return isValid(date) && isTomorrow(date)
      })
      .sort(byScheduledAtAsc)
  }, [data])

  return {
    appointments,
    tomorrowAppointments,
    count: appointments.length,
    isLoading,
    isError,
  }
}
