import { useState } from 'react'
import { ptBR } from 'date-fns/locale'
import { CalendarClock, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Time } from '@/utils/time'

import './reschedule-appointment-dialog.css'

const DEFAULT_TIME = '08:00'

type IRescheduleAppointmentDialog = {
  patientName: string
  isRescheduling: boolean
  onClose: () => void
  onReschedule: (newDate: Date) => Promise<void>
}

export function RescheduleAppointmentDialog({
  patientName,
  isRescheduling,
  onClose,
  onReschedule,
}: IRescheduleAppointmentDialog) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState(DEFAULT_TIME)

  async function handleConfirm() {
    const finalDate = Time.atTime(selectedDate, selectedTime)
    if (!finalDate) return

    await onReschedule(finalDate)
  }

  return (
    <DialogContent className="rad-dialog">
      <DialogHeader>
        <div className="rad-title-row">
          <CalendarClock className="size-5" />
          <DialogTitle>Remarcar Sessão</DialogTitle>
        </div>
        <DialogDescription>
          Escolha o novo horário para <strong>{patientName}</strong>.
        </DialogDescription>
      </DialogHeader>

      <div className="rad-body">
        <div className="rad-calendar-shell">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={ptBR}
            disabled={{ before: Time.now() }}
          />
        </div>

        <div className="rad-time-row">
          <label className="rad-time-label" htmlFor="reschedule-time">
            Horário:
          </label>
          <Input
            id="reschedule-time"
            type="time"
            value={selectedTime}
            onChange={(event) => setSelectedTime(event.target.value)}
            className="rad-time-input"
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={isRescheduling || !selectedDate}
          className="rad-confirm-btn"
        >
          {isRescheduling ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Confirmar Nova Data'
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
