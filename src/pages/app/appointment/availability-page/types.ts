export type ITimeSlot = {
  startTime: string
  endTime: string
}

export type IWeeklySchedule = Record<number, ITimeSlot[]>
