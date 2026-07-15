import { createContext, useContext, useMemo } from 'react'
import { Plus, Trash2, Clock, GripVertical } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import type { ITimeSlot } from '../../types'
import type { IWeekDay } from '../../constants'

import './availability-day-row.css'

export type IAvailabilityDayActions = {
  onAdd: (day: number) => void
  onRemove: (day: number, index: number) => void
  onUpdate: (
    day: number,
    index: number,
    field: keyof ITimeSlot,
    value: string,
  ) => void
}

type IAvailabilityDayContext = {
  dayOfWeek: number
  actions: IAvailabilityDayActions
}

const AvailabilityDayContext = createContext<IAvailabilityDayContext | null>(
  null,
)

function useAvailabilityDay(): IAvailabilityDayContext {
  const context = useContext(AvailabilityDayContext)
  if (!context) {
    throw new Error('TimeSlotCard must render inside AvailabilityDayRow')
  }
  return context
}

type ITimeSlotCard = {
  slot: ITimeSlot
  index: number
}

function TimeSlotCard({ slot, index }: ITimeSlotCard) {
  const { dayOfWeek, actions } = useAvailabilityDay()

  return (
    <div className="group/card adr-slot">
      <GripVertical className="adr-slot-grip" />
      <Clock className="adr-slot-clock" />

      <div className="adr-slot-times">
        <input
          type="time"
          aria-label="Início"
          value={slot.startTime}
          onChange={(event) =>
            actions.onUpdate(dayOfWeek, index, 'startTime', event.target.value)
          }
          className="adr-slot-input"
        />

        <span className="adr-slot-separator">até</span>

        <input
          type="time"
          aria-label="Fim"
          value={slot.endTime}
          onChange={(event) =>
            actions.onUpdate(dayOfWeek, index, 'endTime', event.target.value)
          }
          className="adr-slot-input"
        />
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Remover horário"
        onClick={() => actions.onRemove(dayOfWeek, index)}
        className="adr-slot-remove"
      >
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  )
}

type IAvailabilityDayRow = {
  day: IWeekDay
  slots: ITimeSlot[]
  actions: IAvailabilityDayActions
}

export function AvailabilityDayRow({
  day,
  slots,
  actions,
}: IAvailabilityDayRow) {
  const hasSlots = slots.length > 0

  const context = useMemo(
    () => ({ dayOfWeek: day.dayOfWeek, actions }),
    [day.dayOfWeek, actions],
  )

  const slotsLabel = hasSlots
    ? `${slots.length} ${slots.length > 1 ? 'horários' : 'horário'}`
    : 'Indisponível'

  return (
    <AvailabilityDayContext.Provider value={context}>
      <div className="group adr-root">
        <div className="adr-body">
          <div className="adr-day">
            <div
              className={cn(
                'adr-day-badge',
                !hasSlots && 'adr-day-badge--empty',
              )}
            >
              {day.name.slice(0, 3)}
            </div>
            <div className="flex flex-col">
              <span className="adr-day-name">{day.name}</span>
              <span className="adr-day-count">{slotsLabel}</span>
            </div>
          </div>

          <div className="adr-slots">
            {hasSlots ? (
              <div className="adr-slots-list">
                {slots.map((slot, index) => (
                  <TimeSlotCard key={index} slot={slot} index={index} />
                ))}
              </div>
            ) : (
              <div className="adr-empty">
                <span className="adr-empty-text">
                  Nenhum horário definido para este dia
                </span>
              </div>
            )}
          </div>

          <div className="shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => actions.onAdd(day.dayOfWeek)}
              className="adr-add-btn"
            >
              <Plus className="size-3.5" />
              Adicionar
            </Button>
          </div>
        </div>
      </div>
    </AvailabilityDayContext.Provider>
  )
}
