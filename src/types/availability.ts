export interface AvailabilityHTTP {
  id: string
  psychologistPracticeContextId: string
  dayOfWeek: number
  startTime: string
  endTime: string
  isActive: boolean
}

export type PsychologistAvailability = AvailabilityHTTP
