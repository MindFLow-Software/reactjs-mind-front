'use client'

import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import { format } from 'date-fns'

import { Skeleton } from '@/components/ui/skeleton'

import { CalendarView } from './components/calendar-view'
import { AppointmentDialogManager } from './components/appointment-dialog-manager'

import { type IAppointmentListItem } from '@/api/appointments/get-appointments'
import { useAppointmentsList } from './hooks/use-appointments-list'
import { useCancelAppointment } from './hooks/use-cancel-appointment'
import { useRescheduleAppointment } from './hooks/use-reschedule-appointment'
import type { AppointmentStatus } from '@/types/appointment/appointment-status'
import { useHeaderStore } from '@/store/use-header-store'
import { AppointmentsTableFilters } from './components/appointments-table-filters'

export function AppointmentsList() {
  const { setTitle } = useHeaderStore()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()

  // Estados de Controle de Modais
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isCancelOpen, setIsCancelOpen] = useState(false)
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false)

  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedAppointment, setSelectedAppointment] =
    useState<IAppointmentListItem | null>(null)

  useEffect(() => {
    setTitle('Meus Agendamentos')
  }, [setTitle])

  // Filtros e Parâmetros
  const pageIndex = z.coerce
    .number()
    .transform((p) => p - 1)
    .parse(searchParams.get('pageIndex') ?? '1')
  const status = searchParams.get('status')
  const name = searchParams.get('name')
  const perPage = 100

  // Busca de Dados
  const {
    data: result,
    isLoading,
    isError,
  } = useAppointmentsList({
    pageIndex,
    perPage,
    status: status === 'all' ? null : (status as AppointmentStatus | null),
    name: name || undefined,
  })

  // Tratamento de Dados (visão de calendário: título + intervalo do evento)
  const appointments = useMemo(() => {
    if (!result?.appointments) return []

    return result.appointments.map((app: IAppointmentListItem) => {
      const startDate = new Date(app.scheduledAt)
      const endDate = app.durationInMin
        ? new Date(startDate.getTime() + app.durationInMin * 60 * 1000)
        : new Date(startDate.getTime() + 60 * 60 * 1000)

      // Formatação para visão mensal: "11h Nome"
      const displayTitle = `${format(startDate, "HH'h'")} ${app.patientName}`

      return {
        ...app,
        title: displayTitle,
        start: startDate,
        end: endDate,
      }
    })
  }, [result])

  // Mutações
  const { mutateAsync: cancelFn, isPending: isCancelling } =
    useCancelAppointment()
  const { mutateAsync: rescheduleFn, isPending: isRescheduling } =
    useRescheduleAppointment()

  // Handlers
  const handleSelectSlot = (date: Date) => {
    setSelectedDate(date)
    setIsCreateOpen(true)
  }

  const handleSelectEvent = (appointment: IAppointmentListItem) => {
    setSelectedAppointment(appointment)
    setIsEditOpen(true)
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] gap-4">
        <p className="text-destructive font-medium">
          Erro ao carregar agenda 😕
        </p>
        <button
          onClick={() =>
            queryClient.refetchQueries({ queryKey: ['appointments'] })
          }
          className="text-sm underline text-muted-foreground hover:text-foreground"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  return (
    <>
      <Helmet title="Agenda" />

      <div className="flex flex-col gap-5 mt-6 h-[calc(100vh-10rem)]">
        {/* Filtros e Botão Novo (Padrão PatientsTableFilters) */}
        <AppointmentsTableFilters
          onNewAppointment={() => setIsCreateOpen(true)}
        />

        <div className="flex-1 bg-card rounded-xl border border-border overflow-hidden shadow-sm relative">
          {isLoading ? (
            <div className="h-full p-4">
              <Skeleton className="w-full h-full rounded-lg" />
            </div>
          ) : (
            <CalendarView
              appointments={appointments}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
            />
          )}
        </div>

        <AppointmentDialogManager
          dialogs={{
            isCreateOpen,
            isEditOpen,
            isCancelOpen,
            isRescheduleOpen,
            onCreateOpenChange: setIsCreateOpen,
            onEditOpenChange: setIsEditOpen,
            onCancelOpenChange: setIsCancelOpen,
            onRescheduleOpenChange: setIsRescheduleOpen,
          }}
          selection={{ selectedDate, selectedAppointment }}
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
