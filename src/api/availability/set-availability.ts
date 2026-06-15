import { api } from '@/lib/axios'

export interface AvailabilitySlot {
  dayOfWeek: number
  startTime: string
  endTime: string
}

export async function setAvailability(
  slots: AvailabilitySlot[],
): Promise<void> {
  await api.post('/availabilities', { slots })
}
