import type { ITimeSlot, IWeeklySchedule } from './types'

export type IWeekDay = {
  dayOfWeek: number
  name: string
}

export const WEEK_DAYS: readonly IWeekDay[] = [
  { dayOfWeek: 1, name: 'Segunda' },
  { dayOfWeek: 2, name: 'Terça' },
  { dayOfWeek: 3, name: 'Quarta' },
  { dayOfWeek: 4, name: 'Quinta' },
  { dayOfWeek: 5, name: 'Sexta' },
  { dayOfWeek: 6, name: 'Sábado' },
  { dayOfWeek: 0, name: 'Domingo' },
]

export const DEFAULT_SLOT: ITimeSlot = { startTime: '08:00', endTime: '12:00' }

export function buildEmptySchedule(): IWeeklySchedule {
  return Object.fromEntries(WEEK_DAYS.map((day) => [day.dayOfWeek, []]))
}
