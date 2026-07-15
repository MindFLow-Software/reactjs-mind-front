import { useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { Skeleton } from '@/components/ui/skeleton'
import { useHeaderStore } from '@/store/use-header-store'
import { Time } from '@/utils/time'
import { AppointmentStatus } from '@/types/appointment/appointment-status'
import type { IAppointmentListItem } from '@/api/appointments/get-appointments'

import { CalendarView } from './components/calendar-view/calendar-view'
import { AppointmentDialogManager } from './components/appointment-dialog-manager/appointment-dialog-manager'
import { AppointmentsTableFilters } from './components/appointments-table-filters/appointments-table-filters'
import { useAppointmentsList } from './hooks/use-appointments-list'
import { useCancelAppointment } from './hooks/use-cancel-appointment'
import { useRescheduleAppointment } from './hooks/use-reschedule-appointment'
import { useAppointmentDialogs } from './hooks/use-appointment-dialogs'
import { ALL_STATUS_FILTER, APPOINTMENT_LIST_PER_PAGE } from './constants'
import type { ICalendarAppointment } from './types'

import './appointment-list.css'

const DEFAULT_DURATION_IN_MIN = 60

function toCalendarAppointment(
  appointment: IAppointmentListItem,
): ICalendarAppointment {
  const start = Time.parse(appointment.scheduledAt) ?? new Date(NaN)
  const end =
    Time.addMinutes(
      start,
      appointment.durationInMin ?? DEFAULT_DURATION_IN_MIN,
    ) ?? start

  return {
    id: appointment.id,
    title: `${Time.toHourCompact(start)} ${appointment.patientName}`,
    start,
    end,
    resource: appointment,
  }
}

export function AppointmentsList() {
  const { setTitle } = useHeaderStore()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()

  const dialogs = useAppointmentDialogs()

  useEffect(() => {
    setTitle('Meus Agendamentos')
  }, [setTitle])

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get('pageIndex') ?? '1')
  const status = searchParams.get('status')
  const name = searchParams.get('name')

  const {
    data: result,
    isLoading,
    isError,
  } = useAppointmentsList({
    pageIndex,
    perPage: APPOINTMENT_LIST_PER_PAGE,
    status:
      status === ALL_STATUS_FILTER
        ? null
        : (status as AppointmentStatus | null),
    name: name || undefined,
  })

  const events = useMemo<ICalendarAppointment[]>(() => {
    if (!result?.appointments) return []

    return result.appointments
      .map(toCalendarAppointment)
      .filter((event) => !Number.isNaN(event.start.getTime()))
  }, [result])

  const { mutateAsync: cancelFn, isPending: isCancelling } =
    useCancelAppointment()
  const { mutateAsync: rescheduleFn, isPending: isRescheduling } =
    useRescheduleAppointment()

  function handleRetry() {
    queryClient.refetchQueries({ queryKey: ['appointments'] })
  }

  if (isError) {
    return (
      <div className="apl-error">
        <p className="apl-error-text">Erro ao carregar agenda 😕</p>
        <button onClick={handleRetry} className="apl-error-retry">
          Tentar novamente
        </button>
      </div>
    )
  }

  return (
    <>
      <Helmet title="Agenda" />

      <div className="apl-root">
        <AppointmentsTableFilters onNewAppointment={dialogs.create.open} />

        <div className="apl-calendar-shell">
          {isLoading ? (
            <div className="apl-calendar-skeleton-wrap">
              <Skeleton className="apl-calendar-skeleton" />
            </div>
          ) : (
            <CalendarView
              events={events}
              onSelectSlot={dialogs.selectSlot}
              onSelectEvent={dialogs.selectAppointment}
            />
          )}
        </div>

        <AppointmentDialogManager
          dialogs={dialogs}
          actions={{
            onCancel: cancelFn,
            isCancelling,
            onReschedule: rescheduleFn,
            isRescheduling,
          }}
        />
      </div>
    </>
  )
}
