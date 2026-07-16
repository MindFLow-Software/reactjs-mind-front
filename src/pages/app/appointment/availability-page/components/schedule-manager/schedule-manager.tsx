import { useCallback, useEffect, useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { setAvailability } from '@/api/availability/set-availability'
import type { IPsychologistAvailability } from '@/types/availability/psychologist-availability'

import { AvailabilityDayRow } from '../availability-day-row/availability-day-row'
import type { IAvailabilityDayActions } from '../availability-day-row/availability-day-row'
import { DEFAULT_SLOT, WEEK_DAYS, buildEmptySchedule } from '../../constants'
import type { ITimeSlot, IWeeklySchedule } from '../../types'

import './schedule-manager.css'

type IScheduleManager = {
  defaultData: IPsychologistAvailability[]
}

function buildScheduleFrom(
  availability: IPsychologistAvailability[],
): IWeeklySchedule {
  const schedule = buildEmptySchedule()

  availability.forEach((item) => {
    if (!schedule[item.dayOfWeek]) return

    schedule[item.dayOfWeek].push({
      startTime: item.startTime,
      endTime: item.endTime,
    })
  })

  return schedule
}

export function ScheduleManager({ defaultData }: IScheduleManager) {
  const queryClient = useQueryClient()

  const { mutate: saveAvailability, isPending } = useMutation({
    mutationFn: setAvailability,
    onSuccess: () => {
      toast.success('Agenda salva com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['availability'] })
    },
    onError: () => {
      toast.error('Erro ao salvar agenda')
    },
  })

  const [schedule, setSchedule] = useState<IWeeklySchedule>(buildEmptySchedule)

  const addSlot = useCallback((day: number) => {
    setSchedule((prev) => ({ ...prev, [day]: [...prev[day], DEFAULT_SLOT] }))
  }, [])

  const removeSlot = useCallback((day: number, index: number) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: prev[day].filter((_, position) => position !== index),
    }))
  }, [])

  const updateSlot = useCallback(
    (day: number, index: number, field: keyof ITimeSlot, value: string) => {
      setSchedule((prev) => ({
        ...prev,
        [day]: prev[day].map((slot, position) =>
          position === index ? { ...slot, [field]: value } : slot,
        ),
      }))
    },
    [],
  )

  const actions = useMemo<IAvailabilityDayActions>(
    () => ({ onAdd: addSlot, onRemove: removeSlot, onUpdate: updateSlot }),
    [addSlot, removeSlot, updateSlot],
  )

  function handleSave() {
    const allSlots = Object.entries(schedule).flatMap(([day, slots]) =>
      slots.map((slot) => ({
        dayOfWeek: Number(day),
        startTime: slot.startTime,
        endTime: slot.endTime,
      })),
    )

    if (allSlots.length === 0) {
      toast.error('Adicione pelo menos um horário')
      return
    }

    saveAvailability(allSlots)
  }

  useEffect(() => {
    if (!defaultData || !Array.isArray(defaultData)) return
    if (defaultData.length === 0) return

    console.log('length: ', defaultData.length)
    console.log('here')
    setSchedule(buildScheduleFrom(defaultData))
  }, [defaultData])

  return (
    <div className="sm-root">
      <div className="sm-header">
        <div>
          <h2 className="sm-title">Definir Disponibilidade Recorrente</h2>
          <p className="sm-subtitle">
            Configure os horários padrão para seus atendimentos semanais
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isPending}
          className="sm-save-btn"
        >
          {isPending ? 'Salvando...' : 'Salvar Agenda'}
        </button>
      </div>

      <div className="sm-days">
        {WEEK_DAYS.map((day) => (
          <AvailabilityDayRow
            key={day.dayOfWeek}
            day={day}
            slots={schedule[day.dayOfWeek] ?? []}
            actions={actions}
          />
        ))}
      </div>
    </div>
  )
}
