import { useCallback, useMemo, useState } from 'react'

import type { IAppointmentListItem } from '@/api/appointments/get-appointments'

export type IDialogController = {
  isOpen: boolean
  open: () => void
  close: () => void
  onOpenChange: (open: boolean) => void
}

export type IAppointmentSelection = {
  selectedDate?: Date
  selectedAppointment: IAppointmentListItem | null
}

export type IUseAppointmentDialogs = {
  create: IDialogController
  edit: IDialogController
  cancel: IDialogController
  reschedule: IDialogController
  selection: IAppointmentSelection
  selectSlot: (date: Date) => void
  selectAppointment: (appointment: IAppointmentListItem) => void
}

function useDialogController(): IDialogController {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  return useMemo(
    () => ({ isOpen, open, close, onOpenChange: setIsOpen }),
    [isOpen, open, close],
  )
}

export function useAppointmentDialogs(): IUseAppointmentDialogs {
  const create = useDialogController()
  const edit = useDialogController()
  const cancel = useDialogController()
  const reschedule = useDialogController()

  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedAppointment, setSelectedAppointment] =
    useState<IAppointmentListItem | null>(null)

  const selectSlot = useCallback(
    (date: Date) => {
      setSelectedDate(date)
      create.open()
    },
    [create],
  )

  const selectAppointment = useCallback(
    (appointment: IAppointmentListItem) => {
      setSelectedAppointment(appointment)
      edit.open()
    },
    [edit],
  )

  const selection = useMemo(
    () => ({ selectedDate, selectedAppointment }),
    [selectedDate, selectedAppointment],
  )

  return {
    create,
    edit,
    cancel,
    reschedule,
    selection,
    selectSlot,
    selectAppointment,
  }
}
